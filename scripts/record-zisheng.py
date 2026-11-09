"""Record a reproducible CPU DDPM path from the exported model. The banner is separate vector art."""
import sys,json,math
from pathlib import Path
import numpy as np
import onnxruntime as ort
root=Path(__file__).resolve().parents[1]
opt=ort.SessionOptions();opt.intra_op_num_threads=2
session=ort.InferenceSession(str(root/'assets/models/zisheng/denoiser.onnx'),sess_options=opt,providers=['CPUExecutionProvider'])
state=7
mask=0xffffffff
def random():
 global state
 state=(state+0x6D2B79F5)&mask
 t=((state^(state>>15))*(1|state))&mask
 t^=(t+(((t^(t>>7))*(61|t))&mask))&mask
 return ((t^(t>>14))&mask)/4294967296
x=np.empty(2304,dtype=np.float32)
for i in range(0,2304,2):
 r=math.sqrt(-2*math.log(max(random(),2.220446049250313e-16)));a=2*math.pi*random();x[i]=r*math.cos(a);x[i+1]=r*math.sin(a)
ab=np.cumprod(1-np.linspace(.0001,.02,1000))
schedule=list(reversed(range(1000)))
def pixels(x):return np.floor((np.clip(x,-1,1)+1)*127.5+.5).astype(np.uint8).tolist()
frames=[dict(remaining=1000,pixels=pixels(x))]
for i,t in enumerate(schedule):
 eps=session.run(None,{'image':x.reshape(1,1,48,48),'timestep':np.array([t],np.int64),'character':np.array([4],np.int64)})[0].flatten().astype(np.float64)
 a=ab[t];beta=.0001+t/999*(.02-.0001);alpha=1-beta
 variance=max(1e-20,beta*(1-(ab[t-1] if t else 1))/(1-a))
 mean=(x-beta/math.sqrt(1-a)*eps)/math.sqrt(alpha)
 if t:
  noise=np.empty(2304,dtype=np.float32)
  for j in range(0,2304,2):
   radius=math.sqrt(-2*math.log(max(random(),2.220446049250313e-16)));angle=2*math.pi*random()
   noise[j]=radius*math.cos(angle);noise[j+1]=radius*math.sin(angle)
  x=(mean+math.sqrt(variance)*noise).astype(np.float32)
 else:x=mean.astype(np.float32)
 if t%10==0:frames.append(dict(remaining=t,pixels=pixels(x)))
data={'character':'永','seed':7,'sampler':'1,000-step DDPM, CPU export validation','sourceCommit':'aff9ffde4c26000b8c1d6c1db65a73ad7059b764','frames':frames}
(root/'demos/zisheng/recorded.json').write_text(json.dumps(data,separators=(',',':'),ensure_ascii=False))
print("Recorded 101 original DDPM states.")
