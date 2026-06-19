import os
import mmap
import tempfile
from pathlib import Path
from torch.utils.data import Dataset, DataLoader

CHUNK_SIZE = 64 * 1024 * 1024
PAGE_BATCH = 50
MAX_FILE_BYTES = 100 * 1024 * 1024 * 1024

def validate_pdf_size(path):
    size = os.path.getsize(path)
    if size > MAX_FILE_BYTES:
        raise ValueError(f"File exceeds 100 GB limit: {size} bytes")
    return size

def stream_pdf_pages(path, start_page=0, end_page=None):
    import fitz
    doc = fitz.open(path)
    total = doc.page_count
    end = end_page if end_page is not None else total
    for page_num in range(start_page, min(end, total)):
        page = doc.load_page(page_num)
        yield page_num, page.get_text()
    doc.close()

def process_large_pdf_in_batches(path, output_dir, batch_size=PAGE_BATCH):
    import fitz
    os.makedirs(output_dir, exist_ok=True)
    validate_pdf_size(path)
    doc = fitz.open(path)
    total_pages = doc.page_count
    batch_text = []
    batch_index = 0

    for page_num in range(total_pages):
        page = doc.load_page(page_num)
        batch_text.append(page.get_text())
        if len(batch_text) >= batch_size:
            out_path = Path(output_dir) / f"batch_{batch_index:06d}.txt"
            with open(out_path, "w", encoding="utf-8") as f:
                f.write("\n".join(batch_text))
            batch_text = []
            batch_index += 1

    if batch_text:
        out_path = Path(output_dir) / f"batch_{batch_index:06d}.txt"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(batch_text))

    doc.close()
    return batch_index + 1

class PdfBatchDataset(Dataset):
    def __init__(self, batch_dir):
        self.files = sorted(Path(batch_dir).glob("batch_*.txt"))

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        with open(self.files[idx], "r", encoding="utf-8") as f:
            text = f.read()
        return text

def create_dataloader(batch_dir, batch_size=4):
    dataset = PdfBatchDataset(batch_dir)
    return DataLoader(dataset, batch_size=batch_size, shuffle=False)

def read_pdf_chunk_mmap(path, offset, length):
    with open(path, "rb") as f:
        with mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
            return mm[offset:offset + length]

def parallel_page_ranges(total_pages, num_workers):
    chunk = max(1, total_pages // num_workers)
    ranges = []
    start = 0
    while start < total_pages:
        end = min(start + chunk, total_pages)
        ranges.append((start, end))
        start = end
    return ranges

def extract_pages_range(path, page_range):
    import fitz
    start, end = page_range
    doc = fitz.open(path)
    texts = []
    for page_num in range(start, end):
        texts.append(doc.load_page(page_num).get_text())
    doc.close()
    return start, texts

def process_with_multiprocessing(path, num_workers=4):
    import fitz
    from concurrent.futures import ProcessPoolExecutor
    validate_pdf_size(path)
    doc = fitz.open(path)
    total = doc.page_count
    doc.close()
    ranges = parallel_page_ranges(total, num_workers)
    results = []
    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        futures = [executor.submit(extract_pages_range, path, r) for r in ranges]
        for future in futures:
            results.append(future.result())
    return sorted(results, key=lambda x: x[0])

def stream_to_temp_chunks(path, chunk_bytes=CHUNK_SIZE):
    validate_pdf_size(path)
    temp_dir = tempfile.mkdtemp(prefix="pdf_chunks_")
    chunk_paths = []
    with open(path, "rb") as src:
        index = 0
        while True:
            data = src.read(chunk_bytes)
            if not data:
                break
            chunk_path = os.path.join(temp_dir, f"raw_chunk_{index:06d}.bin")
            with open(chunk_path, "wb") as dst:
                dst.write(data)
            chunk_paths.append(chunk_path)
            index += 1
    return temp_dir, chunk_paths

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python lec16.py <path_to_pdf> [output_dir]")
        sys.exit(1)
    pdf_path = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "pdf_batches"
    file_size = validate_pdf_size(pdf_path)
    print(f"File size: {file_size / (1024**3):.2f} GB")
    num_batches = process_large_pdf_in_batches(pdf_path, out_dir)
    loader = create_dataloader(out_dir)
    print(f"Created {num_batches} batch files in {out_dir}")
    print(f"DataLoader batches: {len(loader)}")
