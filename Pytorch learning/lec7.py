import torch
from torchvision import datasets
from torchvision.transforms import ToTensor, Lambda

ds = datasets.FashionMNIST(
    root="data",
    train=True,
    download=True,
    transform=ToTensor(),
)

tensor_image, label = ds[0]
print(tensor_image.size())
print(label)

lambda_transform = Lambda(
    lambda y: torch.zeros(10, dtype=torch.float).scatter_(
        dim=0, index=torch.tensor(y), value=1
    )
)
label_onehot = lambda_transform(label)
print(label_onehot)
