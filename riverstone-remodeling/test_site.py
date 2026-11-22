from playwright.sync_api import sync_playwright
from pathlib import Path
url='http://127.0.0.1:8765/index.html'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height,label in [(1440,1000,'desktop'),(1216,1200,'reference-size'),(390,844,'mobile'),(375,812,'small-mobile')]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errs=[]
  page.on('pageerror',lambda e: errs.append(str(e)))
  page.goto(url,wait_until='load')
  page.screenshot(path=f'/mnt/data/riverstone-{label}.png',full_page=True)
  print(label, 'pageheight',page.evaluate('document.documentElement.scrollHeight'), 'overflow',page.evaluate('document.documentElement.scrollWidth - window.innerWidth'), 'errors',errs)
  if label=='mobile':
   page.locator('.mobile-nav-toggle').click()
   print('menu opened',page.locator('.mobile-nav').is_visible())
   page.get_by_role('link',name='Our Process').last.click()
   print('menu closed',not page.locator('.mobile-nav').is_visible())
   page.locator('.service-card').first.click()
   print('dialog open',page.locator('#project-dialog').evaluate('(el)=>el.open'), 'selected',page.locator('#form-service').input_value())
   page.locator('#project-dialog input[name=name]').fill('Test User')
   page.locator('#project-dialog input[name=email]').fill('test@example.com')
   page.locator('.form-submit').click()
   print('result visible',page.locator('#form-result').is_visible(), 'summary',page.locator('#project-summary').inner_text()[:110])
  if label=='desktop':
   h=page.locator('#comparison-handle')
   h.focus();page.keyboard.press('ArrowRight')
   print('slider',h.get_attribute('aria-valuenow'))
  page.close()
 browser.close()
