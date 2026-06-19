import torch
import torch.nn as nn
import torch.optim as optim

class TheModelClass(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = torch.flatten(x, 1)
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

model = TheModelClass()
optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

torch.save(model.state_dict(), "model.pth")

model = TheModelClass()
model.load_state_dict(torch.load("model.pth", weights_only=True))
model.eval()

torch.save({
    "epoch": 4,
    "model_state_dict": model.state_dict(),
    "optimizer_state_dict": optimizer.state_dict(),
    "loss": 0.4,
}, "checkpoint.pth")

checkpoint = torch.load("checkpoint.pth", weights_only=False)
model = TheModelClass()
model.load_state_dict(checkpoint["model_state_dict"])
optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
epoch = checkpoint["epoch"]
loss = checkpoint["loss"]

PATH = "model.pth"
torch.save(model, PATH)
model = torch.load(PATH, weights_only=False)
model.eval()
