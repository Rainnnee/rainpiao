"""Draw the conceptual vector banner. Supply the Noto Sans CJK SC OTF path.

Uses fontTools to convert one OFL-licensed glyph to paths, not a raster image.
The points/curves illustrate diffusion; they are not reported model samples.
"""
from pathlib import Path
import math,random,sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
font=TTFont(sys.argv[1]);glyphs=font.getGlyphSet();glyph=glyphs[font.getBestCmap()[ord('永')]]
pen=SVGPathPen(glyphs);glyph.draw(pen);path=pen.getCommands()
bounds=BoundsPen(glyphs);glyph.draw(bounds);x0,y0,x1,y1=bounds.bounds
scale=min(145/(x1-x0),180/(y1-y0));transform=f'translate({564-x0*scale:.3f} {112+y1*scale:.3f}) scale({scale:.6f} {-scale:.6f})'
r=random.Random(19)
parts=['''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 420"><defs>
<linearGradient id="sky" x2="1" y2="1"><stop stop-color="#deedf4"/><stop offset=".55" stop-color="#eef2f1"/><stop offset="1" stop-color="#f5e2ec"/></linearGradient>
<linearGradient id="flow"><stop stop-color="#78a3bd" stop-opacity=".15"/><stop offset=".5" stop-color="#9c9cb9" stop-opacity=".7"/><stop offset="1" stop-color="#4f7890" stop-opacity=".55"/></linearGradient>
<linearGradient id="ink" x2="1" y2="1"><stop stop-color="#28526c"/><stop offset="1" stop-color="#526d86"/></linearGradient>
<marker id="arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 5 2.5 0 5" fill="none" stroke="#7c99ab"/></marker>
</defs><rect width="760" height="420" fill="url(#sky)"/>
<circle cx="695" cy="30" r="185" fill="none" stroke="white" opacity=".5"/><circle cx="695" cy="30" r="160" fill="none" stroke="white" opacity=".3"/>
<path d="M42 350H718" stroke="#b9cbd4" stroke-width=".7"/><path d="M58 334V78" stroke="#b9cbd4" stroke-width=".7"/>
<g stroke="#bfd0d9" stroke-width=".7">''']
for x in range(90,720,30):parts.append(f'<path d="M{x} 347v6"/>')
parts.append('</g>')
# A Gaussian cloud in phase space, drawn entirely as scalable circles.
for _ in range(190):
 x=min(225,max(70,r.gauss(145,33)));y=min(300,max(100,r.gauss(205,43)))
 color=r.choice(['#7196ad','#8caabd','#c3a3ba','#e5cfde','#ffffff'])
 parts.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r.uniform(.9,2.7):.2f}" fill="{color}" opacity="{r.uniform(.3,.85):.2f}"/>')
# Smooth trajectories gather into a structured state, rather than pixel tiles.
for i in range(19):
 y=109+i*10;end=130+i*8.3;bend=r.uniform(-38,38)
 parts.append(f'<path d="M203 {y}C270 {y+bend:.1f} 291 {end-bend:.1f} 359 {end:.1f}S484 {end+bend*.3:.1f} 540 {end:.1f}" fill="none" stroke="url(#flow)" stroke-width="{.7+(i%4)*.23:.2f}"/>')
 for fraction in [.28,.55,.8]:
  x=205+fraction*335;ypos=y+(end-y)*fraction
  parts.append(f'<circle cx="{x:.1f}" cy="{ypos:.1f}" r="1.5" fill="{["#96b6c9","#c7a7bc"][i%2]}" opacity=".6"/>')
parts.append('''<ellipse cx="368" cy="204" rx="65" ry="99" fill="#f9fbfa" fill-opacity=".25" stroke="white" stroke-opacity=".65"/>
<ellipse cx="368" cy="204" rx="47" ry="80" fill="none" stroke="#a8bfce" stroke-dasharray="2 6" opacity=".6"/>
<g font-family="Georgia,serif" fill="#5e7e92"><text x="349" y="210" font-size="25">ε<tspan baseline-shift="sub" font-size="15">θ</tspan></text></g>
<path d="M366 91V125" fill="none" stroke="#ae8fa7" stroke-dasharray="3 4"/>
<rect x="333" y="58" width="69" height="30" rx="15" fill="#faf7f8" stroke="#dcc5d4"/>
<text x="350" y="78" font-family="Georgia,serif" font-size="13" fill="#9b7992">y = 永</text>
<path d="M494 310C515 300 535 299 554 299" fill="none" stroke="#789aad" marker-end="url(#arrow)"/>
''')
parts.append(f'<path d="{path}" transform="{transform}" fill="url(#ink)"/>')
parts.append('''<g fill="#6f8a9d" font-family="Georgia,serif" font-size="15"><text x="88" y="64">x<tspan baseline-shift="sub" font-size="10">T</tspan> ∼ N(0,I)</text><text x="552" y="64">p<tspan baseline-shift="sub" font-size="10">θ</tspan>(x<tspan baseline-shift="sub" font-size="10">0</tspan> | y)</text></g>
<g font-family="Georgia,serif" font-size="13" fill="#6d8495"><text x="77" y="381">Noise</text><text x="305" y="381">Learned reverse process</text><text x="568" y="381">Character</text></g>
<circle cx="145" cy="350" r="3" fill="#8eacc1"/><circle cx="368" cy="350" r="3" fill="#c1a0b8"/><circle cx="629" cy="350" r="3" fill="#527d98"/>
</svg>''')
root=Path(__file__).resolve().parents[1]
(root/'assets/images/concepts/zisheng.svg').write_text(''.join(parts))
print('Created scalable vector illustration: circles, curves, glyph paths; no raster images.')
