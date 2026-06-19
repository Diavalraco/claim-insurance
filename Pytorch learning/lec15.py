import torch
import torch.nn as nn

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

if torch.cuda.is_available():
    print(torch.cuda.get_device_name(0))
    print(f"Memory Allocated: {torch.cuda.memory_allocated(0) / 1024**2:.2f} MB")

x = torch.ones(2, 2)
print(x.device)

cuda = torch.device("cuda")
x = torch.ones(2, 2, device=cuda)
print(x)

x = torch.ones(2, 2)
y = torch.ones(2, 2)
z = x + y
print(z.device)

x = torch.ones(2, 2)
y = torch.ones(2, 2)
cuda = torch.device("cuda")
x_c = x.to(cuda)
y_c = y.to(cuda)
z_c = x_c + y_c
print(z_c.device)

x = torch.rand(2, 2)
cuda = torch.device("cuda")
x_d = x.to(cuda)
print(x_d)
print(x)
print(x_d.to("cpu"))

class MyModule(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(10, 5)
        self.fc2 = nn.Linear(5, 2)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x)

module = MyModule()
module.to(device)
input_tensor = torch.randn(4, 10).to(device)
output = module(input_tensor)
print(output.device)

if torch.cuda.is_available():
    torch.cuda.empty_cache()
