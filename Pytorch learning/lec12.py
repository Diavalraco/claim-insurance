import torch
import torch.nn as nn

class RNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size, n_layers=1):
        super().__init__()
        self.hidden_size = hidden_size
        self.n_layers = n_layers
        self.i2h = nn.Linear(input_size + hidden_size, hidden_size)
        self.i2o = nn.Linear(input_size + hidden_size, output_size)
        self.softmax = nn.LogSoftmax(dim=1)

    def forward(self, input, hidden):
        combined = torch.cat((input, hidden), 1)
        hidden = self.i2h(combined)
        output = self.i2o(combined)
        output = self.softmax(output)
        return output, hidden

    def initHidden(self):
        return torch.zeros(1, self.hidden_size)

n_letters = 26
n_hidden = 128
n_categories = 5

def letterToIndex(letter):
    return ord(letter) - ord("a")

def lineToTensor(line):
    tensor = torch.zeros(len(line), 1, n_letters)
    for li, letter in enumerate(line):
        tensor[li][0][letterToIndex(letter)] = 1
    return tensor

rnn = RNN(n_letters, n_hidden, n_categories)
input_line = "Albert"
input_tensor = lineToTensor(input_line)
hidden = rnn.initHidden()
for i in range(input_tensor.size()[0]):
    output, hidden = rnn(input_tensor[i], hidden)

print(output)
