from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math, os
SRC='/mnt/data/1000062777.png'
OUT=os.path.join(os.path.dirname(__file__), 'assets')
os.makedirs(OUT,exist_ok=True)
im=Image.open(SRC).convert('RGB')
sx=im.width/1216;sy=im.height/1242
def crop(box):return im.crop(tuple(round(v*(sx if i%2==0 else sy)) for i,v in enumerate(box)))
def save(name,img,quality=89):
 img.save(os.path.join(OUT,name),quality=quality,optimize=True,subsampling=0)
# Hero composed from source photo and dark out-of-focus foliage, without the screenshot's navigation or text.
W,H=1800,650
base=Image.new('RGB',(W,H),(20,25,23))
foliage=crop((0,0,330,100)).resize((1000,H),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(17))
foliage=ImageEnhance.Brightness(foliage).enhance(.53)
base.paste(foliage,(0,0))
hero=crop((471,64,1216,379)).resize((1320,H),Image.Resampling.LANCZOS)
mask=Image.new('L',(1320,H));d=ImageDraw.Draw(mask)
for x in range(1320):
 m=max(0,min(255,int((x-60)/440*255)))
 if x>1220:m=int(m*max(.80,1-(x-1220)/100*.10))
 d.line((x,0,x,H),fill=m)
base.paste(hero,(480,0),mask)
# Gently mute image below text while preserving crew on the right.
shade=Image.new('RGBA',(W,H),(0,0,0,0));sd=ImageDraw.Draw(shade)
for x in range(W):
 a=int(117*max(0,1-(x/1030)**1.75))
 if a:sd.line((x,0,x,H),fill=(8,11,11,a))
base=Image.alpha_composite(base.convert('RGBA'),shade).convert('RGB')
save('hero-background.jpg',base,92)
# Process circles from the supplied design, keeping gold border and ordinal marker.
for name,box in {
  'process-plan.jpg':(61,481,246,670),
  'process-build.jpg':(442,480,627,668),
  'process-enjoy.jpg':(825,480,1012,668),
}.items():save(name,crop(box),94)
# Full bleed (different visual before/after states), avoiding original slider knob.
save('before-kitchen-clean.jpg',crop((32,692,335,882)).resize((1000,580),Image.Resampling.LANCZOS),92)
save('after-kitchen-clean.jpg',crop((380,692,729,882)).resize((1000,580),Image.Resampling.LANCZOS),92)
# Small category previews and project cards.
for name,box in {
  'service-kitchen.jpg':(242,993,356,1063),
  'service-bathroom.jpg':(368,993,482,1063),
  'service-addition.jpg':(493,993,607,1063),
  'service-living.jpg':(620,993,734,1063),
  'service-whole-home.jpg':(746,993,859,1063),
}.items():save(name,crop(box).resize((570,350),Image.Resampling.LANCZOS),91)
save('project-kitchen.jpg',crop((380,692,729,847)).resize((950,490),Image.Resampling.LANCZOS),91)
save('project-craftsman.jpg',crop((746,993,859,1063)).resize((950,560),Image.Resampling.LANCZOS),90)
save('project-addition.jpg',crop((493,993,607,1063)).resize((950,560),Image.Resampling.LANCZOS),90)
save('cta-tools.jpg',crop((0,1099,375,1242)).resize((970,370),Image.Resampling.LANCZOS),90)
# Remove unused preliminary crops from exploratory output.
for old in ['hero_right.jpg','hero_team.jpg','planning.jpg','building.jpg','finished_kitchen.jpg','before_kitchen.jpg','after_kitchen.jpg','cta.jpg','cta_tools.jpg','service_kitchen.jpg','service_bath.jpg','service_addition.jpg','service_living.jpg','service_wholehome.jpg']:
 try:os.remove(os.path.join(OUT,old))
 except FileNotFoundError:pass
