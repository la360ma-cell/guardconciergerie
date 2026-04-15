'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  Save, RefreshCw, Monitor, Tablet, Smartphone, Check, Loader2,
  ChevronDown, Type, Palette, AlignLeft, AlignCenter, AlignRight,
  X, Eye, EyeOff, MousePointer, LayoutTemplate, Plus, ArrowUp, ArrowDown,
  GripVertical, Layers, ArrowLeft
} from 'lucide-react'
import { SECTION_NAMES, SECTION_LABELS, buildSectionOnlyCSS } from '@/lib/appearance'

// ── Fonts & constants ─────────────────────────────────────────────────────────
const ALL_FONTS = [
  { value: '', label: 'Par défaut' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Playfair Display',   label: 'Playfair Display' },
  { value: 'EB Garamond',        label: 'EB Garamond' },
  { value: 'Lora',               label: 'Lora' },
  { value: 'Merriweather',       label: 'Merriweather' },
  { value: 'Libre Baskerville',  label: 'Libre Baskerville' },
  { value: 'Cinzel',             label: 'Cinzel' },
  { value: 'Inter',              label: 'Inter' },
  { value: 'Poppins',            label: 'Poppins' },
  { value: 'Montserrat',         label: 'Montserrat' },
  { value: 'Outfit',             label: 'Outfit' },
  { value: 'DM Sans',            label: 'DM Sans' },
  { value: 'Raleway',            label: 'Raleway' },
  { value: 'Nunito',             label: 'Nunito' },
]
const FONT_SIZES = ['12px','13px','14px','15px','16px','18px','20px','22px','24px','28px','32px','36px','42px','48px','56px','64px','72px','80px','96px']
const LINE_HEIGHTS = ['1','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','2','2.5']
const FONT_WEIGHTS = [
  { v:'300', l:'Léger' }, { v:'400', l:'Normal' }, { v:'500', l:'Moyen' },
  { v:'600', l:'Semi-gras' }, { v:'700', l:'Gras' },
]
const TRANSFORMS = [
  { v:'', l:'Aucune' }, { v:'uppercase', l:'MAJ' },
  { v:'lowercase', l:'min' }, { v:'capitalize', l:'Titre' },
]

type DeviceW = 'desktop'|'tablet'|'mobile'
const DEVICE_W: Record<DeviceW,string> = { desktop:'100%', tablet:'768px', mobile:'375px' }

// ── Type for clicked element ──────────────────────────────────────────────────
type ElementStyle = {
  color?: string; fontFamily?: string; fontSize?: string; fontWeight?: string
  backgroundColor?: string; borderColor?: string; borderRadius?: string
  paddingX?: string; paddingY?: string
  hoverColor?: string; hoverBackgroundColor?: string; hoverBorderColor?: string
}
type ClickedEl = {
  eid: string
  cssPath: string
  sectionId: string
  tagName: string
  text: string
  className: string
  elType: 'heading'|'body'|'section-bg'|'button'|'other'
  computed: Record<string, string>
}

// ── Reusable field components ─────────────────────────────────────────────────
function ColorField({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value||'#000000'} onChange={e=>onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5 flex-shrink-0"/>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="#…"
        className="flex-1 min-w-0 px-2 py-1.5 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
      {value && <button onClick={()=>onChange('')} className="text-obsidian-400 hover:text-red-400 flex-shrink-0"><X size={11}/></button>}
    </div>
  )
}
function SelectField({ value, options, onChange }: { value:string; options:{v:string,l:string}[]; onChange:(v:string)=>void }) {
  return (
    <div className="relative">
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-xs bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 appearance-none pr-6 text-white">
        {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none"/>
    </div>
  )
}
function FontField({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div className="relative">
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-xs bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 appearance-none pr-6 text-white">
        {ALL_FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none"/>
    </div>
  )
}
function SizeField({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div className="flex gap-1">
      <div className="relative flex-1">
        <select value={FONT_SIZES.includes(value)?value:''} onChange={e=>onChange(e.target.value)}
          className="w-full px-2 py-1.5 text-xs bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 appearance-none pr-5 text-white">
          <option value=''>Défaut</option>
          {FONT_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-obsidian-400 pointer-events-none"/>
      </div>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="libre"
        className="w-16 px-2 py-1.5 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
    </div>
  )
}
function AlignField({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div className="flex gap-1">
      {(['left','center','right'] as const).map(a=>{
        const Icon = a==='left'?AlignLeft:a==='center'?AlignCenter:AlignRight
        return (
          <button key={a} onClick={()=>onChange(a==='left'?'':a)}
            className={`p-1.5 rounded-lg border transition-all ${(value||'left')===a?'border-gold-500 bg-gold-500/20 text-gold-400':'border-white/10 text-obsidian-400 hover:border-white/30'}`}>
            <Icon size={12}/>
          </button>
        )
      })}
    </div>
  )
}
function Row({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
      <p className="text-[10px] text-obsidian-400 uppercase tracking-wide font-medium leading-tight">{label}</p>
      <div>{children}</div>
    </div>
  )
}

// ── Click-to-Edit contextual panel ───────────────────────────────────────────
function ClickEditPanel({
  el, styles, elementStyle, onChange, onElementChange, onClose
}: {
  el: ClickedEl
  styles: Record<string,string>
  elementStyle: ElementStyle
  onChange: (key:string, val:string)=>void
  onElementChange: (prop:string, val:string)=>void
  onClose: ()=>void
}) {
  const n = el.sectionId
  const g = (k:string) => styles[`section_${n}_${k}`] || ''
  const s = (k:string, v:string) => onChange(`section_${n}_${k}`, v)
  const sectionLabel = (SECTION_LABELS as Record<string, string>)[n] || n
  const [showSection, setShowSection] = useState(false)

  const isText = el.elType === 'heading' || el.elType === 'body' || el.elType === 'other'

  return (
    <div className="flex flex-col h-full">
      {/* Element badge */}
      <div className="px-4 py-3 bg-gold-500/10 border-b border-gold-500/20 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <MousePointer size={11} className="text-gold-400"/>
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">Élément sélectionné</span>
          </div>
          <button onClick={onClose} className="p-0.5 rounded text-obsidian-400 hover:text-white hover:bg-white/10 transition-colors">
            <X size={12}/>
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-obsidian-800 rounded text-[10px] font-mono text-gold-300 border border-gold-500/30">{`<${el.tagName}>`}</span>
          <span className="text-[10px] text-obsidian-300">dans</span>
          <span className="text-[10px] text-white font-semibold">{sectionLabel}</span>
        </div>
        {el.text && (
          <p className="mt-1.5 text-[10px] text-obsidian-500 italic truncate">« {el.text.slice(0,55)}{el.text.length>55?'…':''} »</p>
        )}
        <p className="mt-1 text-[9px] text-emerald-500/80 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"/>
          Modification de cet élément uniquement
        </p>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto">

        {/* ── PER-ELEMENT controls (primary) ─────────────────────────────── */}
        {isText && el.elType !== 'section-bg' && (
          <div className="px-4 py-4 space-y-3">
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <MousePointer size={10}/> Cet élément uniquement
            </p>
            <Row label="Couleur">
              <ColorField value={elementStyle.color||''} onChange={v=>onElementChange('color',v)}/>
            </Row>
            <Row label="Police">
              <FontField value={elementStyle.fontFamily||''} onChange={v=>onElementChange('fontFamily',v)}/>
            </Row>
            <Row label="Taille">
              <SizeField value={elementStyle.fontSize||''} onChange={v=>onElementChange('fontSize',v)}/>
            </Row>
            <Row label="Graisse">
              <div className="flex gap-1 flex-wrap">
                {FONT_WEIGHTS.map(w=>(
                  <button key={w.v} onClick={()=>onElementChange('fontWeight', elementStyle.fontWeight===w.v?'':w.v)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-all ${elementStyle.fontWeight===w.v?'border-gold-500 bg-gold-500/20 text-gold-400':'border-white/10 text-obsidian-400 hover:border-white/30'}`}
                    style={{fontWeight:w.v}}>{w.l}</button>
                ))}
              </div>
            </Row>
            <div className="border-t border-white/5 pt-3 mt-1">
              <p className="text-[9px] text-obsidian-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Eye size={9}/> Au survol (hover)
              </p>
              <Row label="Couleur">
                <ColorField value={elementStyle.hoverColor||''} onChange={v=>onElementChange('hoverColor',v)}/>
              </Row>
            </div>
          </div>
        )}

        {el.elType === 'button' && (
          <div className="px-4 py-4 space-y-3">
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <MousePointer size={10}/> Ce bouton uniquement
            </p>
            <Row label="Fond">
              <ColorField value={elementStyle.backgroundColor||''} onChange={v=>onElementChange('backgroundColor',v)}/>
            </Row>
            <Row label="Texte">
              <ColorField value={elementStyle.color||''} onChange={v=>onElementChange('color',v)}/>
            </Row>
            <Row label="Bordure">
              <ColorField value={elementStyle.borderColor||''} onChange={v=>onElementChange('borderColor',v)}/>
            </Row>
            <Row label="Arrondi">
              <div className="flex gap-1">
                {[{v:'2px',l:'□'},{v:'8px',l:'⬜'},{v:'16px',l:'▢'},{v:'9999px',l:'⭕'}].map(r=>(
                  <button key={r.v} onClick={()=>onElementChange('borderRadius', elementStyle.borderRadius===r.v?'':r.v)}
                    className={`flex-1 py-1 rounded text-[11px] border transition-all ${elementStyle.borderRadius===r.v?'border-gold-500 bg-gold-500/20 text-gold-400':'border-white/10 text-obsidian-400 hover:border-white/30'}`}>
                    {r.l}
                  </button>
                ))}
                <input type="text" value={elementStyle.borderRadius||''} onChange={e=>onElementChange('borderRadius',e.target.value)} placeholder="px"
                  className="w-14 px-2 py-1 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
              </div>
            </Row>
            <Row label="Police">
              <FontField value={elementStyle.fontFamily||''} onChange={v=>onElementChange('fontFamily',v)}/>
            </Row>
            <Row label="Taille">
              <SizeField value={elementStyle.fontSize||''} onChange={v=>onElementChange('fontSize',v)}/>
            </Row>
            <Row label="Graisse">
              <div className="flex gap-1 flex-wrap">
                {FONT_WEIGHTS.map(w=>(
                  <button key={w.v} onClick={()=>onElementChange('fontWeight', elementStyle.fontWeight===w.v?'':w.v)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-all ${elementStyle.fontWeight===w.v?'border-gold-500 bg-gold-500/20 text-gold-400':'border-white/10 text-obsidian-400 hover:border-white/30'}`}
                    style={{fontWeight:w.v}}>{w.l}</button>
                ))}
              </div>
            </Row>
            <Row label="Padding H.">
              <input type="text" value={elementStyle.paddingX||''} onChange={e=>onElementChange('paddingX',e.target.value)} placeholder="24px"
                className="w-full px-2 py-1.5 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
            </Row>
            <Row label="Padding V.">
              <input type="text" value={elementStyle.paddingY||''} onChange={e=>onElementChange('paddingY',e.target.value)} placeholder="12px"
                className="w-full px-2 py-1.5 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
            </Row>
            <div className="border-t border-white/5 pt-3 mt-1">
              <p className="text-[9px] text-obsidian-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Eye size={9}/> Au survol (hover)
              </p>
              <div className="space-y-2">
                <Row label="Fond">
                  <ColorField value={elementStyle.hoverBackgroundColor||''} onChange={v=>onElementChange('hoverBackgroundColor',v)}/>
                </Row>
                <Row label="Texte">
                  <ColorField value={elementStyle.hoverColor||''} onChange={v=>onElementChange('hoverColor',v)}/>
                </Row>
                <Row label="Bordure">
                  <ColorField value={elementStyle.hoverBorderColor||''} onChange={v=>onElementChange('hoverBorderColor',v)}/>
                </Row>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION-LEVEL controls (secondary / collapsible) ──────────── */}
        <div className="border-t border-white/5">
          <button onClick={()=>setShowSection(!showSection)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <span className="text-[10px] text-obsidian-400 font-medium flex items-center gap-1.5">
              <Palette size={10}/> Modifier toute la section « {sectionLabel} »
            </span>
            <ChevronDown size={10} className={`text-obsidian-500 transition-transform ${showSection?'rotate-180':''}`}/>
          </button>
          {showSection && (
            <div className="px-4 pb-4 space-y-3 bg-obsidian-950/30">
              <Row label="Fond section"><ColorField value={g('bg')} onChange={v=>s('bg',v)}/></Row>
              <Row label="Tous les titres"><ColorField value={g('heading_color')} onChange={v=>s('heading_color',v)}/></Row>
              <Row label="Tous les textes"><ColorField value={g('body_color')} onChange={v=>s('body_color',v)}/></Row>
              <Row label="Police titres"><FontField value={g('heading_font')} onChange={v=>s('heading_font',v)}/></Row>
              <Row label="Police textes"><FontField value={g('body_font')} onChange={v=>s('body_font',v)}/></Row>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ── Full section style panel (manual mode) ────────────────────────────────────
function SectionStylePanel({ name, styles, onChange }: {
  name:string; styles:Record<string,string>; onChange:(key:string,val:string)=>void
}) {
  const g = (k:string) => styles[`section_${name}_${k}`] || ''
  const s = (k:string, v:string) => onChange(`section_${name}_${k}`, v)

  function Block({ title, icon, children, open:def=true }: {
    title:string; icon?:React.ReactNode; children:React.ReactNode; open?:boolean
  }) {
    const [o,setO]=useState(def)
    return (
      <div className="border-b border-white/5 last:border-0">
        <button onClick={()=>setO(!o)} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-obsidian-300 uppercase tracking-wider">{icon}<span>{title}</span></div>
          <ChevronDown size={10} className={`text-obsidian-500 transition-transform ${o?'rotate-180':''}`}/>
        </button>
        {o && <div className="px-4 pb-4 space-y-3">{children}</div>}
      </div>
    )
  }

  return (
    <div className="divide-y divide-white/5">
      <Block title="Fond" icon={<Palette size={10}/>}>
        <Row label="Couleur"><ColorField value={g('bg')} onChange={v=>s('bg',v)}/></Row>
        <Row label="Padding V.">
          <input type="text" value={g('py')} onChange={e=>s('py',e.target.value)} placeholder="80px"
            className="w-full px-2 py-1.5 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
        </Row>
      </Block>
      <Block title="Titres H1–H3" icon={<Type size={10}/>}>
        <Row label="Couleur"><ColorField value={g('heading_color')} onChange={v=>s('heading_color',v)}/></Row>
        <Row label="Police"><FontField value={g('heading_font')} onChange={v=>s('heading_font',v)}/></Row>
        <Row label="Taille"><SizeField value={g('heading_size')} onChange={v=>s('heading_size',v)}/></Row>
        <Row label="Graisse">
          <div className="flex gap-1 flex-wrap">
            {FONT_WEIGHTS.map(w=>(
              <button key={w.v} onClick={()=>s('heading_weight',g('heading_weight')===w.v?'':w.v)}
                className={`px-2 py-0.5 rounded text-[10px] border transition-all ${g('heading_weight')===w.v?'border-gold-500 bg-gold-500/20 text-gold-400':'border-white/10 text-obsidian-400 hover:border-white/30'}`}
                style={{fontWeight:w.v}}>{w.l}</button>
            ))}
          </div>
        </Row>
        <Row label="Alignement"><AlignField value={g('heading_align')} onChange={v=>s('heading_align',v)}/></Row>
        <Row label="Interligne"><SelectField value={g('heading_lh')} options={[{v:'',l:'Défaut'},...LINE_HEIGHTS.map(v=>({v,l:v}))]} onChange={v=>s('heading_lh',v)}/></Row>
        <Row label="Espacement">
          <input type="text" value={g('heading_ls')} onChange={e=>s('heading_ls',e.target.value)} placeholder="0.05em"
            className="w-full px-2 py-1.5 text-xs font-mono bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
        </Row>
        <Row label="Casse"><SelectField value={g('heading_transform')} options={TRANSFORMS.map(t=>({v:t.v,l:t.l}))} onChange={v=>s('heading_transform',v)}/></Row>
      </Block>
      <Block title="Texte courant" icon={<Type size={10}/>} open={false}>
        <Row label="Couleur"><ColorField value={g('body_color')} onChange={v=>s('body_color',v)}/></Row>
        <Row label="Police"><FontField value={g('body_font')} onChange={v=>s('body_font',v)}/></Row>
        <Row label="Taille"><SizeField value={g('body_size')} onChange={v=>s('body_size',v)}/></Row>
        <Row label="Interligne"><SelectField value={g('body_lh')} options={[{v:'',l:'Défaut'},...LINE_HEIGHTS.map(v=>({v,l:v}))]} onChange={v=>s('body_lh',v)}/></Row>
        <Row label="Alignement"><AlignField value={g('body_align')} onChange={v=>s('body_align',v)}/></Row>
      </Block>
      <Block title="Labels / badges" open={false}>
        <Row label="Couleur"><ColorField value={g('label_color')} onChange={v=>s('label_color',v)}/></Row>
        <Row label="Taille"><SizeField value={g('label_size')} onChange={v=>s('label_size',v)}/></Row>
      </Block>
      <div className="px-4 py-3">
        <button onClick={()=>{
          const keys=['bg','heading_color','heading_font','heading_size','heading_weight','heading_align','heading_lh','heading_ls','heading_transform','body_color','body_font','body_size','body_lh','body_align','label_color','label_size','py']
          keys.forEach(k=>onChange(`section_${name}_${k}`,''))
        }} className="text-[10px] text-obsidian-500 hover:text-red-400 flex items-center gap-1 transition-colors">
          <RefreshCw size={9}/> Réinitialiser la section
        </button>
      </div>
    </div>
  )
}

// ── Content panel ─────────────────────────────────────────────────────────────
function ContentPanel({ section }: { section:string }) {
  const [items, setItems] = useState<Array<{ id: number; key: string; section: string; valueFr: string; valueEn: string }>>([])
  const [changes, setChanges] = useState<Record<string,{fr:string,en:string}>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(()=>{
    fetch(`/api/content?section=${section}`)
      .then(r=>r.json())
      .then(d=>{ setItems(Array.isArray(d)?d:[]); setChanges({}) })
      .catch(()=>{ setItems([]) })
  },[section])

  const get=(item:{ key: string; section: string; valueFr: string; valueEn: string },lang:'fr'|'en')=>{
    const f=lang==='fr'?'valueFr':'valueEn'
    return changes[item.key]?.[lang]??item[f]??''
  }
  const change=(key:string,lang:'fr'|'en',val:string)=>{
    const item=items.find(i=>i.key===key)
    setChanges(prev=>({...prev,[key]:{fr:prev[key]?.fr??item?.valueFr??'',en:prev[key]?.en??item?.valueEn??'',[lang]:val}}))
  }
  const save=async()=>{
    if(!Object.keys(changes).length)return
    setSaving(true)
    const updates=Object.entries(changes).map(([key,v])=>({key,valueFr:v.fr,valueEn:v.en}))
    await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({updates})})
    setSaved(true); setTimeout(()=>setSaved(false),2000); setSaving(false)
  }

  if(!items.length) return(
    <div className="p-6 text-xs text-obsidian-500 text-center">Aucun contenu pour cette section.</div>
  )
  return(
    <div>
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <p className="text-[10px] text-obsidian-400">{items.length} texte(s)</p>
        <button onClick={save} disabled={saving||!Object.keys(changes).length}
          className="flex items-center gap-1 px-3 py-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-white rounded-lg text-[10px] font-medium transition-colors">
          {saving?<Loader2 size={9} className="animate-spin"/>:saved?<Check size={9}/>:<Save size={9}/>}
          {saved?'Sauvegardé':saving?'…':'Sauvegarder'}
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {items.map(item=>(
          <div key={item.key} className="px-4 py-3 space-y-2">
            <code className="text-[10px] text-gold-500">{item.key}</code>
            <div className="grid grid-cols-2 gap-2">
              {(['fr','en'] as const).map(lang=>(
                <div key={lang}>
                  <p className="text-[9px] text-obsidian-400 mb-1">{lang==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</p>
                  {((lang==='fr'?item.valueFr:item.valueEn)||'').length>80?(
                    <textarea rows={2} value={get(item,lang)} onChange={e=>change(item.key,lang,e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-obsidian-900 border border-white/10 rounded-lg resize-none focus:outline-none focus:border-gold-500 text-white"/>
                  ):(
                    <input type="text" value={get(item,lang)} onChange={e=>change(item.key,lang,e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-obsidian-900 border border-white/10 rounded-lg focus:outline-none focus:border-gold-500 text-white"/>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Script injected into iframe for click interactions ────────────────────────
const INJECTED_SCRIPT = `
if (!window.__editorReady) {
  window.__editorReady = true;
  var st = document.createElement('style');
  st.id = '__editor_styles__';
  st.textContent = [
    '.__eh{outline:2px solid rgba(212,146,43,0.55)!important;outline-offset:3px!important;cursor:pointer!important;}',
    '.__es{outline:3px solid rgb(212,146,43)!important;outline-offset:3px!important;box-shadow:0 0 0 6px rgba(212,146,43,0.12)!important;}',
    '.__et{position:fixed!important;top:10px!important;left:50%!important;transform:translateX(-50%)!important;background:rgba(12,12,12,0.92)!important;color:#ffaa00!important;padding:5px 12px!important;border-radius:20px!important;font-size:11px!important;font-family:monospace!important;z-index:99999!important;pointer-events:none!important;border:1px solid rgba(212,146,43,0.4)!important;white-space:nowrap!important;}'
  ].join('');
  document.head.appendChild(st);

  var tip = document.createElement('div');
  tip.className = '__et';
  tip.style.display = 'none';
  document.body.appendChild(tip);

  var hovered = null, selected = null;
  var eidCounter = 0;

  var SMAP = {top:'hero',about:'about',services:'services',whyus:'whyus',process:'process',stats:'stats',testimonials:'testimonials',faq:'faq',contact:'contact'};
  var SMAP_SEL = {hero:'#top',about:'#about',services:'#services',whyus:'#whyus',process:'#process',stats:'#stats',testimonials:'#testimonials',faq:'#faq',contact:'#contact',footer:'footer'};

  function getSection(el) {
    var node = el;
    while (node && node !== document.body) {
      if (node.tagName === 'FOOTER') return 'footer';
      if (node.id && SMAP[node.id]) return SMAP[node.id];
      node = node.parentElement;
    }
    return 'hero';
  }

  // Generate a stable CSS selector path from section root to element
  function getCSSPath(el, secEl, secSel) {
    if (el === secEl) return secSel;
    var parts = [];
    var cur = el;
    while (cur && cur !== secEl && cur !== document.body) {
      var tag = cur.tagName.toLowerCase();
      var par = cur.parentElement;
      if (!par || par === secEl) { parts.unshift(tag); break; }
      var siblings = [];
      for (var i = 0; i < par.children.length; i++) {
        if (par.children[i].tagName === cur.tagName) siblings.push(par.children[i]);
      }
      if (siblings.length > 1) {
        var nth = Array.prototype.indexOf.call(siblings, cur) + 1;
        parts.unshift(tag + ':nth-of-type(' + nth + ')');
      } else {
        parts.unshift(tag);
      }
      cur = par;
    }
    return secSel + ' ' + parts.join(' > ');
  }

  function getElType(tag, cls) {
    var t = tag.toLowerCase();
    var c = cls || '';
    if (['h1','h2','h3','h4','h5'].indexOf(t)>-1) return 'heading';
    if (t==='button') return 'button';
    if (c.match(/btn|cta-btn/)) return 'button';
    if (['p','li','span'].indexOf(t)>-1) return 'body';
    if (['section','footer','main'].indexOf(t)>-1) return 'section-bg';
    if (t==='div'&&c.match(/section/)) return 'section-bg';
    return 'other';
  }

  function getLabel(tag) {
    var m={h1:'Titre H1',h2:'Titre H2',h3:'Titre H3',h4:'Titre H4',h5:'Titre H5',p:'Paragraphe',li:'Élément',span:'Texte',section:'Section',footer:'Footer',button:'Bouton',a:'Lien',div:'Bloc'};
    return m[tag.toLowerCase()]||tag.toUpperCase();
  }

  document.addEventListener('mouseover',function(e){
    var el=e.target;
    if(el===document.body||el===document.documentElement||el===tip||el.id==='__editor_styles__') return;
    if(hovered&&hovered!==selected) hovered.classList.remove('__eh');
    hovered=el;
    if(el!==selected){
      el.classList.add('__eh');
      tip.textContent=getLabel(el.tagName)+' — cliquez pour modifier';
      tip.style.display='block';
    }
  },true);

  document.addEventListener('mouseout',function(e){
    if(e.target!==selected) e.target.classList&&e.target.classList.remove('__eh');
    tip.style.display='none';
  },true);

  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(a){e.preventDefault();e.stopPropagation();}
    var el=e.target;
    if(el===tip||el.id==='__editor_styles__') return;
    if(selected){selected.classList.remove('__es');selected.classList.remove('__eh');}
    selected=el;
    el.classList.add('__es');
    // Assign stable eid for direct targeting
    if (!el.dataset.eid) { eidCounter++; el.dataset.eid = 'eid_' + eidCounter; }
    var eid = el.dataset.eid;
    // Generate stable CSS selector path for saving
    var secName = getSection(el);
    var secSel = SMAP_SEL[secName] || 'body';
    var secEl = document.querySelector(secSel);
    var cssPath = secEl ? getCSSPath(el, secEl, secSel) : secSel;
    var cs=window.getComputedStyle(el);
    window.parent.postMessage({
      type:'editor-element-click',
      eid: eid,
      cssPath: cssPath,
      sectionId:secName,
      tagName:el.tagName.toLowerCase(),
      text:(el.innerText||'').trim().slice(0,120),
      className:el.className||'',
      elType:getElType(el.tagName,el.className||''),
      computed:{color:cs.color,fontSize:cs.fontSize,fontFamily:cs.fontFamily,fontWeight:cs.fontWeight,textAlign:cs.textAlign,lineHeight:cs.lineHeight,backgroundColor:cs.backgroundColor}
    },'*');
    e.preventDefault();
  },true);

  // ── Live style application via postMessage (direct DOM — beats all CSS) ──
  var SEC_SEL = {hero:'#top',about:'#about',services:'#services',whyus:'#whyus',process:'#process',stats:'#stats',testimonials:'#testimonials',faq:'#faq',contact:'#contact',footer:'footer'};
  var SEC_LIST = ['hero','about','services','whyus','process','stats','testimonials','faq','contact','footer'];

  function applyProp(el, color) {
    if (color) {
      el.style.setProperty('color', color, 'important');
      el.style.setProperty('-webkit-text-fill-color', color, 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('-webkit-background-clip', 'unset', 'important');
      el.style.setProperty('background-clip', 'unset', 'important');
    } else {
      el.style.removeProperty('color');
      el.style.removeProperty('-webkit-text-fill-color');
      el.style.removeProperty('background-image');
      el.style.removeProperty('-webkit-background-clip');
      el.style.removeProperty('background-clip');
    }
  }

  function inHeading(el, sec) {
    var p = el.parentElement;
    while (p && p !== sec) {
      if (['H1','H2','H3','H4','H5','H6'].indexOf(p.tagName) > -1) return true;
      var pc = typeof p.className === 'string' ? p.className : '';
      if (pc.indexOf('font-display') > -1) return true;
      p = p.parentElement;
    }
    return false;
  }

  function isButton(el) {
    var t = el.tagName;
    var cls = typeof el.className === 'string' ? el.className : '';
    return t === 'BUTTON' || cls.indexOf('btn') > -1 || cls.indexOf('cta') > -1;
  }

  function applyElStyle(el, s) {
    var btn = isButton(el);
    if ('color' in s) {
      if (s.color) {
        el.style.setProperty('color', s.color, 'important');
        el.style.setProperty('-webkit-text-fill-color', s.color, 'important');
        // Don't clear background-image for buttons (would remove gradient BG)
        if (!btn) {
          el.style.setProperty('background-image', 'none', 'important');
          el.style.setProperty('-webkit-background-clip', 'unset', 'important');
          el.style.setProperty('background-clip', 'unset', 'important');
        }
      } else {
        el.style.removeProperty('color');
        el.style.removeProperty('-webkit-text-fill-color');
        if (!btn) el.style.removeProperty('background-image');
      }
    }
    if ('fontFamily' in s) {
      if (s.fontFamily) el.style.setProperty('font-family', '"' + s.fontFamily + '", sans-serif', 'important');
      else el.style.removeProperty('font-family');
    }
    if ('fontSize' in s) {
      if (s.fontSize) el.style.setProperty('font-size', s.fontSize, 'important');
      else el.style.removeProperty('font-size');
    }
    if ('fontWeight' in s) {
      if (s.fontWeight) el.style.setProperty('font-weight', s.fontWeight, 'important');
      else el.style.removeProperty('font-weight');
    }
    if ('backgroundColor' in s) {
      if (s.backgroundColor) {
        el.style.setProperty('background-color', s.backgroundColor, 'important');
        el.style.setProperty('background-image', 'none', 'important');
      } else {
        el.style.removeProperty('background-color');
        el.style.removeProperty('background-image');
      }
    }
    if ('borderColor' in s) {
      if (s.borderColor) el.style.setProperty('border-color', s.borderColor, 'important');
      else el.style.removeProperty('border-color');
    }
    if ('borderRadius' in s) {
      if (s.borderRadius) el.style.setProperty('border-radius', s.borderRadius, 'important');
      else el.style.removeProperty('border-radius');
    }
    if ('paddingX' in s) {
      if (s.paddingX) {
        el.style.setProperty('padding-left', s.paddingX, 'important');
        el.style.setProperty('padding-right', s.paddingX, 'important');
      } else {
        el.style.removeProperty('padding-left');
        el.style.removeProperty('padding-right');
      }
    }
    if ('paddingY' in s) {
      if (s.paddingY) {
        el.style.setProperty('padding-top', s.paddingY, 'important');
        el.style.setProperty('padding-bottom', s.paddingY, 'important');
      } else {
        el.style.removeProperty('padding-top');
        el.style.removeProperty('padding-bottom');
      }
    }
  }

  window.addEventListener('message', function(ev) {
    if (!ev.data) return;

    // ── Per-element precise style ──────────────────────────────────────────
    if (ev.data.type === 'editor-element-style') {
      var target = document.querySelector('[data-eid="' + ev.data.eid + '"]');
      if (target) applyElStyle(target, ev.data.styles || {});
      return;
    }

    // ── Section visibility (instant hide/show) ────────────────────────────
    if (ev.data.type === 'editor-sections') {
      var hidden = ev.data.hidden || [];
      var secSelMap = {hero:'#top',about:'#about',services:'#services',whyus:'#whyus',process:'#process',stats:'#stats',testimonials:'#testimonials',faq:'#faq',contact:'#contact',footer:'footer'};
      Object.keys(secSelMap).forEach(function(n) {
        var el = document.querySelector(secSelMap[n]);
        if (!el) return;
        if (hidden.indexOf(n) > -1) el.style.setProperty('display','none','important');
        else el.style.removeProperty('display');
      });
      return;
    }

    // ── Hover CSS injection ────────────────────────────────────────────────
    if (ev.data.type === 'editor-hover-css') {
      var hoverEl = document.getElementById('__editor_hover__');
      if (!hoverEl) {
        hoverEl = document.createElement('style');
        hoverEl.id = '__editor_hover__';
        document.head.appendChild(hoverEl);
      }
      hoverEl.textContent = ev.data.css || '';
      return;
    }

    if (ev.data.type !== 'editor-apply-styles') return;
    var stls = ev.data.styles || {};
    SEC_LIST.forEach(function(nm) {
      var sec = document.querySelector(SEC_SEL[nm]);
      if (!sec) return;
      var g = function(k) { return stls['section_' + nm + '_' + k] || ''; };
      var hc = g('heading_color');
      var bc = g('body_color');
      var bg = g('bg');

      // Background
      if (bg) sec.style.setProperty('background-color', bg, 'important');
      else sec.style.removeProperty('background-color');

      // Body color — broad first pass (p, li, em, strong, small, b)
      ['p','li','em','strong','small','b'].forEach(function(tag) {
        sec.querySelectorAll(tag).forEach(function(el) { applyProp(el, bc); });
      });
      // Spans not inside headings / font-display
      sec.querySelectorAll('span').forEach(function(el) {
        if (!inHeading(el, sec)) applyProp(el, bc);
      });
      // Divs that are text-size utilities (but NOT font-display — those are headings)
      sec.querySelectorAll('div').forEach(function(el) {
        var cls = typeof el.className === 'string' ? el.className : '';
        if (!cls.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/)) return;
        if (cls.indexOf('font-display') > -1) return;
        applyProp(el, bc);
      });
      // Links (non-button, non-cta)
      sec.querySelectorAll('a').forEach(function(el) {
        var cls = el.className || '';
        if (cls.indexOf('btn') === -1 && cls.indexOf('cta') === -1) applyProp(el, bc);
      });

      // Heading color — applied AFTER body, overrides for headings + ALL their descendants
      sec.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function(el) {
        applyProp(el, hc);
        el.querySelectorAll('*').forEach(function(c) { applyProp(c, hc); });
      });
      // .font-display elements (stat values, initials, step numbers, etc.)
      sec.querySelectorAll('div,span').forEach(function(el) {
        var cls = typeof el.className === 'string' ? el.className : '';
        if (cls.indexOf('font-display') === -1) return;
        applyProp(el, hc);
        el.querySelectorAll('*').forEach(function(c) { applyProp(c, hc); });
      });
    });
  });
}
`

// ── Sections management panel ─────────────────────────────────────────────────
function SectionsPanel({
  sectionsOrder, hiddenSections, onToggle, onMove
}: {
  sectionsOrder: string[]
  hiddenSections: Set<string>
  onToggle: (name:string)=>void
  onMove: (name:string, dir:1|-1)=>void
}) {
  const visible = sectionsOrder.filter(n=>!hiddenSections.has(n))
  const hidden = [...SECTION_NAMES].filter(n=>hiddenSections.has(n))

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Active sections */}
      <div className="px-3 py-4">
        <p className="text-[9px] text-obsidian-500 uppercase tracking-widest mb-2.5 flex items-center gap-1">
          <Layers size={8}/> Sections actives — glissez pour réordonner
        </p>
        <div className="space-y-1.5">
          {visible.map((name, i)=>(
            <div key={name} className="flex items-center gap-1.5 px-2.5 py-2 bg-obsidian-800 rounded-xl border border-white/10 group">
              <GripVertical size={11} className="text-obsidian-600 flex-shrink-0"/>
              <span className="text-[11px] text-white flex-1 truncate font-medium">{(SECTION_LABELS as Record<string, string>)[name]}</span>
              <button onClick={()=>onMove(name,-1)} disabled={i===0}
                className="p-1 rounded text-obsidian-500 hover:text-white disabled:opacity-20 transition-colors">
                <ArrowUp size={10}/>
              </button>
              <button onClick={()=>onMove(name,1)} disabled={i===visible.length-1}
                className="p-1 rounded text-obsidian-500 hover:text-white disabled:opacity-20 transition-colors">
                <ArrowDown size={10}/>
              </button>
              <button onClick={()=>onToggle(name)} title="Masquer cette section"
                className="p-1 rounded text-obsidian-500 hover:text-red-400 transition-colors ml-0.5">
                <EyeOff size={11}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden sections */}
      {hidden.length > 0 && (
        <div className="px-3 pb-4 border-t border-white/5 pt-3">
          <p className="text-[9px] text-obsidian-500 uppercase tracking-widest mb-2.5 flex items-center gap-1">
            <EyeOff size={8}/> Sections masquées
          </p>
          <div className="space-y-1.5">
            {hidden.map(name=>(
              <div key={name} className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-dashed border-white/10 bg-obsidian-900/50">
                <span className="text-[11px] text-obsidian-500 flex-1 line-through truncate">{(SECTION_LABELS as Record<string, string>)[name]}</span>
                <button onClick={()=>onToggle(name)}
                  className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 rounded-lg px-2 py-0.5 transition-all">
                  <Plus size={9}/> Afficher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 pb-4 pt-2 border-t border-white/5">
        <p className="text-[9px] text-obsidian-600 text-center leading-relaxed">
          Les modifications d'ordre et visibilité s'appliquent en direct.<br/>
          Cliquez <strong>Sauvegarder</strong> pour les rendre permanentes.
        </p>
      </div>
    </div>
  )
}

// ── Main editor page ──────────────────────────────────────────────────────────
export default function VisualEditorPage() {
  const params = useParams()
  const locale = (params.locale as string) || 'fr'
  const prefix = locale === 'en' ? '/en' : ''

  const [section, setSection] = useState<string>('hero')
  const [tab, setTab] = useState<'style'|'content'|'sections'>('style')
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([...SECTION_NAMES])
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set())
  const [styles, setStyles] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [device, setDevice] = useState<DeviceW>('desktop')
  const [iframeKey, setIframeKey] = useState(0)
  const [clickedEl, setClickedEl] = useState<ClickedEl|null>(null)
  const [elementStyles, setElementStyles] = useState<Record<string,ElementStyle>>({})
  const [eidToPath, setEidToPath] = useState<Record<string,string>>({})
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const stylesRef = useRef<Record<string,string>>({})
  const eidToPathRef = useRef<Record<string,string>>({})

  // Helper: generate hover CSS for live preview (uses data-eid)
  const buildHoverCSS = useCallback((eStyles: Record<string,ElementStyle>, paths: Record<string,string>) => {
    return Object.entries(paths).map(([eid, _]) => {
      const s = eStyles[eid]
      if (!s) return ''
      const r: string[] = []
      if (s.hoverColor) { r.push(`color:${s.hoverColor} !important;`); r.push(`-webkit-text-fill-color:${s.hoverColor} !important;`) }
      if (s.hoverBackgroundColor) { r.push(`background-color:${s.hoverBackgroundColor} !important;`); r.push(`background-image:none !important;`) }
      if (s.hoverBorderColor) r.push(`border-color:${s.hoverBorderColor} !important;`)
      if (!r.length) return ''
      return `[data-eid="${eid}"]:hover{${r.join('')}}`
    }).filter(Boolean).join('\n')
  }, [])

  // Load section styles + order + visibility from DB
  useEffect(()=>{
    const load = async () => {
      try {
        const r = await fetch('/api/settings?category=sections')
        const data = await r.json()
        const map: Record<string,string> = {}
        if (Array.isArray(data)) data.forEach((s: { key: string; value: string }) => { map[s.key] = s.value })
        setStyles(map)
        stylesRef.current = map
        // Restore sections order
        if (map.sections_order) {
          const order = map.sections_order.split(',').filter(Boolean)
          setSectionsOrder(order)
        }
        // Restore hidden sections
        const hidden = new Set<string>()
        ;(SECTION_NAMES as readonly string[]).forEach(name => {
          if (map[`section_${name}_hidden`] === 'true') hidden.add(name)
        })
        setHiddenSections(hidden)
      } catch {
        // DB unavailable — use defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  },[])

  // Listen for click events from iframe
  useEffect(()=>{
    const handler=(e:MessageEvent)=>{
      if(e.data?.type==='editor-element-click'){
        const d = e.data
        setClickedEl({ eid:d.eid, cssPath:d.cssPath, sectionId:d.sectionId, tagName:d.tagName, text:d.text, className:d.className, elType:d.elType, computed:d.computed })
        setSection(d.sectionId)
        setTab('style')
        // Register cssPath mapping for this eid
        if (d.eid && d.cssPath) {
          setEidToPath(prev => {
            const next = { ...prev, [d.eid]: d.cssPath }
            eidToPathRef.current = next
            return next
          })
        }
      }
    }
    window.addEventListener('message',handler)
    return ()=>window.removeEventListener('message',handler)
  },[])

  // ── Live CSS injection into iframe ──────────────────────────────────────────
  const injectLiveCSS = useCallback((currentStyles: Record<string,string>)=>{
    const iframe = iframeRef.current
    if(!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if(!doc || !doc.head) return
      let el = doc.getElementById('__editor_live__') as HTMLStyleElement|null
      if(!el) {
        el = doc.createElement('style')
        el.id = '__editor_live__'
        doc.head.appendChild(el)
      }
      el.textContent = buildSectionOnlyCSS(currentStyles)
    } catch {}
  },[])

  // ── Inject interaction script + initial CSS ─────────────────────────────────
  const injectAll = useCallback(()=>{
    const iframe = iframeRef.current
    if(!iframe) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if(!doc) return
      // Inject interaction script
      doc.getElementById('__editor_script__')?.remove()
      const script = doc.createElement('script')
      script.id = '__editor_script__'
      script.textContent = INJECTED_SCRIPT
      doc.head.appendChild(script)
      // Inject current live CSS (stylesheet-level override)
      injectLiveCSS(stylesRef.current)
      // Also send styles via postMessage for direct DOM element override (beats ALL CSS)
      setTimeout(()=>{
        iframe.contentWindow?.postMessage({ type:'editor-apply-styles', styles:stylesRef.current }, '*')
        const hoverCSS = buildHoverCSS(elementStyles, eidToPathRef.current)
        if (hoverCSS) iframe.contentWindow?.postMessage({ type:'editor-hover-css', css:hoverCSS }, '*')
        // Re-apply section visibility
        iframe.contentWindow?.postMessage({ type:'editor-sections', hidden:Array.from(hiddenSections) }, '*')
      }, 50)
    } catch(err) {
      console.warn('Editor inject failed:', err)
    }
  },[injectLiveCSS, buildHoverCSS, elementStyles, hiddenSections])

  // ── Handle style change — live preview immediately ──────────────────────────
  const handleChange = useCallback((key:string, val:string)=>{
    setStyles(prev=>{
      const next = { ...prev, [key]: val }
      stylesRef.current = next
      injectLiveCSS(next)
      iframeRef.current?.contentWindow?.postMessage({ type:'editor-apply-styles', styles:next }, '*')
      return next
    })
    setSaved(false)
  },[injectLiveCSS])

  // ── Handle per-element style change ─────────────────────────────────────────
  const handleElementStyleChange = useCallback((eid:string, prop:string, val:string)=>{
    setElementStyles(prev=>{
      const nextStyle = { ...(prev[eid]||{}), [prop]: val }
      const next = { ...prev, [eid]: nextStyle }
      const isHover = prop.startsWith('hover')
      if (!isHover) {
        // Apply direct DOM style (non-hover)
        iframeRef.current?.contentWindow?.postMessage({ type:'editor-element-style', eid, styles:nextStyle }, '*')
      }
      // Always regenerate and inject hover CSS (covers both new hover rules and reset)
      const hoverCSS = buildHoverCSS(next, eidToPathRef.current)
      iframeRef.current?.contentWindow?.postMessage({ type:'editor-hover-css', css:hoverCSS }, '*')
      return next
    })
    setSaved(false)
  },[buildHoverCSS])

  // ── Section toggle (show / hide) ────────────────────────────────────────────
  const handleSectionToggle = useCallback((name:string)=>{
    setHiddenSections(prev=>{
      const next = new Set(prev)
      if(next.has(name)) next.delete(name)
      else next.add(name)
      iframeRef.current?.contentWindow?.postMessage({ type:'editor-sections', hidden:Array.from(next) }, '*')
      return next
    })
    setSaved(false)
  },[])

  // ── Section reorder ──────────────────────────────────────────────────────────
  const handleSectionMove = useCallback((name:string, dir:1|-1)=>{
    setSectionsOrder(prev=>{
      const i = prev.indexOf(name)
      if(i<0) return prev
      const j = i+dir
      if(j<0||j>=prev.length) return prev
      const next=[...prev];[next[i],next[j]]=[next[j],next[i]]
      return next
    })
    setSaved(false)
  },[])

  // ── Save to DB ──────────────────────────────────────────────────────────────
  const save = async()=>{
    setSaving(true)
    // Section-level styles
    const toSave = Object.entries(styles)
      .filter(([k])=>k.startsWith('section_'))
      .map(([key,value])=>({key,value,category:'sections'}))
    // Sections order & visibility
    toSave.push({ key:'sections_order', value:sectionsOrder.join(','), category:'sections' })
    ;(SECTION_NAMES as readonly string[]).forEach(name=>{
      toSave.push({ key:`section_${name}_hidden`, value:hiddenSections.has(name)?'true':'', category:'sections' })
    })
    // Per-element styles → generate custom CSS
    const elementCSSRules = Object.entries(eidToPath).flatMap(([eid, path])=>{
      const s = elementStyles[eid]
      if (!s) return []
      const result: string[] = []
      // Normal state
      const normal: string[] = []
      if (s.color) { normal.push(`color:${s.color} !important;`); normal.push(`-webkit-text-fill-color:${s.color} !important;`) }
      if (s.fontFamily) normal.push(`font-family:"${s.fontFamily}",sans-serif !important;`)
      if (s.fontSize) normal.push(`font-size:${s.fontSize} !important;`)
      if (s.fontWeight) normal.push(`font-weight:${s.fontWeight} !important;`)
      if (s.backgroundColor) { normal.push(`background-color:${s.backgroundColor} !important;`); normal.push(`background-image:none !important;`) }
      if (s.borderColor) normal.push(`border-color:${s.borderColor} !important;`)
      if (s.borderRadius) normal.push(`border-radius:${s.borderRadius} !important;`)
      if (s.paddingX) normal.push(`padding-left:${s.paddingX} !important;padding-right:${s.paddingX} !important;`)
      if (s.paddingY) normal.push(`padding-top:${s.paddingY} !important;padding-bottom:${s.paddingY} !important;`)
      if (normal.length) result.push(`${path}{${normal.join('')}}`)
      // Hover state
      const hover: string[] = []
      if (s.hoverColor) { hover.push(`color:${s.hoverColor} !important;`); hover.push(`-webkit-text-fill-color:${s.hoverColor} !important;`) }
      if (s.hoverBackgroundColor) { hover.push(`background-color:${s.hoverBackgroundColor} !important;`); hover.push(`background-image:none !important;`) }
      if (s.hoverBorderColor) hover.push(`border-color:${s.hoverBorderColor} !important;`)
      if (hover.length) result.push(`${path}:hover{${hover.join('')}}`)
      return result
    }).filter(Boolean)
    if (elementCSSRules.length) {
      toSave.push({ key:'appearance_custom_element_css', value: elementCSSRules.join('\n'), category:'appearance' })
    }
    if(!toSave.length){ setSaving(false); return }
    await fetch('/api/settings',{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(toSave)
    })
    setSaved(true)
    setTimeout(()=>setSaved(false),3000)
    setSaving(false)
    injectLiveCSS(styles)
  }

  const refreshPreview=()=>{ setIframeKey(k=>k+1); setClickedEl(null); setElementStyles({}); setEidToPath({}) }

  if(loading) return(
    <div className="fixed inset-0 flex items-center justify-center bg-obsidian-950">
      <Loader2 className="animate-spin text-gold-500" size={40}/>
    </div>
  )

  return (
    <div className="fixed inset-0 flex bg-obsidian-950 z-40" style={{paddingLeft:0}}>

      {/* ── LEFT PANEL ── */}
      <div className="w-[340px] lg:w-[370px] flex-shrink-0 bg-obsidian-900 border-r border-white/5 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-white/5 flex-shrink-0 bg-obsidian-950">
          <div className="flex items-center gap-2 min-w-0">
            <a
              href={`${prefix}/admin/dashboard`}
              title="Retour au tableau de bord"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-obsidian-400 hover:text-gold-400 hover:border-gold-500/40 transition-all"
            >
              <ArrowLeft size={13}/>
            </a>
            <LayoutTemplate size={13} className="text-gold-400 flex-shrink-0"/>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-tight">Éditeur Visuel</p>
              <p className="text-[9px] text-obsidian-400 truncate">Cliquez sur un élément pour le modifier</p>
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white rounded-lg text-xs font-medium transition-colors">
            {saving?<Loader2 size={11} className="animate-spin"/>:saved?<Check size={11}/>:<Save size={11}/>}
            {saved?'Sauvegardé !':saving?'…':'Sauvegarder'}
          </button>
        </div>

        {/* Live indicator */}
        {clickedEl && (
          <div className="px-4 py-1.5 bg-gold-500/5 border-b border-gold-500/10 flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"/>
            <span className="text-[9px] text-gold-400 font-medium">Preview en direct actif</span>
          </div>
        )}

        {/* If element clicked → contextual panel */}
        {clickedEl ? (
          <ClickEditPanel
            el={clickedEl}
            styles={styles}
            elementStyle={elementStyles[clickedEl.eid] || {}}
            onChange={handleChange}
            onElementChange={(prop,val)=>handleElementStyleChange(clickedEl.eid, prop, val)}
            onClose={()=>setClickedEl(null)}
          />
        ) : (
          <>
            <div className="flex border-b border-white/5 flex-shrink-0">
              {([
                {k:'style', label:'🎨 Style'},
                {k:'content', label:'✏️ Contenu'},
                {k:'sections', label:'⚡ Sections'},
              ] as const).map(({k,label})=>(
                <button key={k} onClick={()=>setTab(k)}
                  className={`flex-1 py-2.5 text-[9px] font-semibold uppercase tracking-widest transition-colors ${tab===k?'text-gold-400 border-b-2 border-gold-500':'text-obsidian-500 hover:text-obsidian-200'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Sections manager tab */}
            {tab==='sections' && (
              <SectionsPanel
                sectionsOrder={sectionsOrder}
                hiddenSections={hiddenSections}
                onToggle={handleSectionToggle}
                onMove={handleSectionMove}
              />
            )}

            {tab!=='sections' && (
            <div className="flex flex-1 overflow-hidden">
              <div className="w-24 flex-shrink-0 bg-obsidian-950/60 border-r border-white/5 overflow-y-auto">
                {SECTION_NAMES.map(name=>{
                  const hasStyles=Object.keys(styles).some(k=>k.startsWith(`section_${name}_`)&&styles[k])
                  const isHidden=hiddenSections.has(name)
                  return(
                    <button key={name} onClick={()=>setSection(name)}
                      className={`w-full text-left px-2 py-2.5 text-[10px] transition-colors relative ${section===name?'bg-obsidian-800 text-gold-400 border-r-2 border-r-gold-500 font-semibold':isHidden?'text-obsidian-600 hover:bg-white/5':'text-obsidian-500 hover:text-white hover:bg-white/5'}`}>
                      <span className={`leading-tight block ${isHidden?'line-through':''}`}>{(SECTION_LABELS as Record<string, string>)[name]||name}</span>
                      {hasStyles&&<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold-500"/>}
                      {isHidden&&<span className="absolute top-1.5 right-1.5 text-[7px] text-red-400">off</span>}
                    </button>
                  )
                })}
              </div>
              <div className="flex-1 overflow-y-auto">
                {tab==='style'?(
                  <SectionStylePanel name={section} styles={styles} onChange={handleChange}/>
                ):(
                  <ContentPanel section={section}/>
                )}
              </div>
            </div>
            )}
          </>
        )}
      </div>

      {/* ── RIGHT PANEL (preview) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-obsidian-900 border-b border-white/5 flex-shrink-0">
          <div className="flex gap-0.5 bg-obsidian-950 rounded-lg p-0.5">
            {(['desktop','tablet','mobile'] as DeviceW[]).map(d=>{
              const Icon=d==='desktop'?Monitor:d==='tablet'?Tablet:Smartphone
              return(
                <button key={d} onClick={()=>setDevice(d)}
                  className={`p-1.5 rounded-md transition-all ${device===d?'bg-obsidian-700 text-white shadow':'text-obsidian-500 hover:text-obsidian-200'}`}>
                  <Icon size={13}/>
                </button>
              )
            })}
          </div>
          <div className="flex-1 bg-obsidian-950 rounded-lg px-3 py-1 text-[10px] text-obsidian-500 font-mono truncate">
            {prefix||''}/
          </div>
          {clickedEl && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gold-500/10 border border-gold-500/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"/>
              <span className="text-[10px] text-gold-400">{`<${clickedEl.tagName}>`} · {(SECTION_LABELS as Record<string, string>)[clickedEl.sectionId]||clickedEl.sectionId}</span>
              <button onClick={()=>setClickedEl(null)} className="ml-1 text-obsidian-400 hover:text-white"><X size={10}/></button>
            </div>
          )}
          <button onClick={refreshPreview} title="Recharger le preview" className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw size={13}/>
          </button>
          <a href={prefix||'/'} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-white/10 transition-all" title="Ouvrir le site">
            <Eye size={13}/>
          </a>
          <span className="text-[10px] text-obsidian-500 hidden sm:block">{DEVICE_W[device]}</span>
        </div>

        {/* iframe */}
        <div className="flex-1 overflow-auto bg-obsidian-950 flex items-start justify-center py-4">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
            style={{width:DEVICE_W[device],height:'100%',minHeight:'100%',maxWidth:'100%'}}>
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={`${prefix||'/'}`}
              className="w-full"
              style={{minHeight:'800px',height:'100%',border:'none',display:'block'}}
              title="Site preview"
              onLoad={injectAll}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
