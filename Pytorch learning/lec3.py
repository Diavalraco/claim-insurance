import torch

x = torch.ones(2, 2, requires_grad=True)
print(x)

y = x + 2
print(y)

z = y * y * 3
out = z.mean()
print(z, out)

out.backward()
print(x.grad)

x = torch.ones(2, 2, requires_grad=True)
y = x + 2
z = y * y * 3
z1 = z.mean()
z1.backward()
print(x.grad)

x.grad.zero_()
z2 = z.sum()
z2.backward()
print(x.grad)

x = torch.ones(2, 2, requires_grad=True)
y = x + 2
z = y * y * 3
z.backward(torch.ones_like(z))
print(x.grad)

with torch.no_grad():
    y = x * 2

x.requires_grad_(False)
print(x.requires_grad)

y = x.detach()
print(y.requires_grad)
