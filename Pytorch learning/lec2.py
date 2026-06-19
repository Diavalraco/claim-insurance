import torch
import numpy as np

tensor = torch.ones(4)
print(tensor)
print(tensor[0])
print(tensor[-1])
print(tensor[:3])

t1 = torch.cat([tensor, tensor, tensor])
print(t1)

t2 = t1.reshape(3, 4)
print(t2)
print(t2.T)

y1 = tensor @ tensor
y2 = tensor.matmul(tensor)
y3 = torch.rand_like(tensor)
torch.matmul(tensor, y3, out=y3)
y4 = tensor.dot(tensor)
print(y1, y2, y3, y4)

a = np.ones(5)
b = torch.from_numpy(a)
np.add(a, 1, out=a)
print(a)
print(b)

the_array = b.numpy()
print(the_array)
