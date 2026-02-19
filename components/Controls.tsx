import React, { useState, useEffect } from 'react';
import {
  Sparkles, User, Ruler, Scissors, Palette, Lightbulb,
  ChevronDown, Check, Undo2, Redo2, Zap, LayoutTemplate,
  Star, Heart, Smile, Droplets
} from 'lucide-react';
import { PresetStyle, GenerationConfig } from '../types';

interface ControlsProps {
  onGenerate: (prompt: string, config: GenerationConfig) => void;
  isLoading: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Helper to get an image URL for a style
const getStyleImage = (gender: string, style: string) => {
  // Comprehensive map of styles to images
  const map: Record<string, string> = {
    // MEN - Short
    'Buzz Cut': 'https://images.unsplash.com/photo-1599351431202-6e0000a40000?w=500&h=500&fit=crop',
    'Fade': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&h=500&fit=crop',
    'High Fade': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=500&fit=crop',
    'Mid Fade': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&h=500&fit=crop',
    'Low Fade': 'https://images.unsplash.com/photo-1594947933946-778832c32cf4?w=500&h=500&fit=crop',
    'Drop Fade': 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&h=500&fit=crop',
    'Skin Fade': 'https://images.unsplash.com/photo-1572965733194-784e4b4efa45?w=500&h=500&fit=crop',
    'Crew Cut': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&h=500&fit=crop',
    'Caesar Cut': 'https://images.unsplash.com/photo-1559582798-678dfc71ccd1?w=500&h=500&fit=crop',
    'Textured Crop': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&h=500&fit=crop',
    'French Crop': 'https://images.unsplash.com/photo-1493106338551-381c82823023?w=500&h=500&fit=crop', // Specific crop look
    'Ivy League': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop',
    'Flat Top': 'https://images.unsplash.com/photo-1534030347209-7147fd9e791a?w=500&h=500&fit=crop', // Distinctive

    // MEN - Medium
    'Quiff': 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&h=500&fit=crop',
    'Modern Quiff': 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=500&h=500&fit=crop',
    'Pompadour': 'https://images.unsplash.com/photo-1595956553838-14449a6f0855?w=500&h=500&fit=crop',
    'Side Part': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    'Undercut': 'https://images.unsplash.com/photo-1562159278-1253a58da141?w=500&h=500&fit=crop',
    'Slicked Back': 'https://images.unsplash.com/photo-1521119989659-a83eee488058?w=500&h=500&fit=crop',
    'Faux Hawk': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&h=500&fit=crop',
    'Messy Fringe': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&h=500&fit=crop',
    'Mullet': 'https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=500&h=500&fit=crop',

    // MEN - Long
    'Man Bun': 'https://images.unsplash.com/photo-1518552697813-2287f39d1b6a?w=500&h=500&fit=crop',
    'Top Knot': 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=500&h=500&fit=crop',
    'Shoulder Length': 'https://images.unsplash.com/photo-1618077553780-75637e8bb697?w=500&h=500&fit=crop',
    'Flow': 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?w=500&h=500&fit=crop',
    'Wolf Cut': 'https://images.unsplash.com/photo-1504199367614-2c0388402f0e?w=500&h=500&fit=crop', // Rougher look
    'Surfer': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
    'Dreadlocks': 'https://images.unsplash.com/photo-1520338661084-680395057c93?w=500&h=500&fit=crop',

    // WOMEN - Short
    'Pixie': 'https://images.unsplash.com/photo-1620331317312-74b88bf40907?w=500&h=500&fit=crop',
    'Long Pixie': 'https://images.unsplash.com/photo-1574722772633-e401c59da840?w=500&h=500&fit=crop',
    'Textured Pixie': 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=500&h=500&fit=crop',
    'Undercut Pixie': 'https://images.unsplash.com/photo-1595867332308-4d6934444983?w=500&h=500&fit=crop',
    'Bob': 'https://images.unsplash.com/photo-1605980776566-0486c3ac5049?w=500&h=500&fit=crop',
    'French Bob': 'https://images.unsplash.com/photo-1582252199088-h8u7e8b2f8a8?w=500&h=500&fit=crop',
    'Italian Bob': 'https://images.unsplash.com/photo-1603570388466-eb4ee54e1b5c?w=500&h=500&fit=crop',
    'Box Bob': 'https://images.unsplash.com/photo-1485290334039-a3c69043e541?w=500&h=500&fit=crop',
    'Bowl Cut': 'https://images.unsplash.com/photo-1519699047748-a864006e8c4b?w=500&h=500&fit=crop',
    'Mixie': 'https://images.unsplash.com/photo-1523264939339-c89f9dadde2e?w=500&h=500&fit=crop',

    // WOMEN - Medium
    'Lob': 'https://images.unsplash.com/photo-1492106087820-71f170094930?w=500&h=500&fit=crop',
    'Blunt Lob': 'https://images.unsplash.com/photo-1583336663277-620dc1996580?w=500&h=500&fit=crop',
    'Textured Lob': 'https://images.unsplash.com/photo-1519764622345-23439dd774f7?w=500&h=500&fit=crop',
    'Shag': 'https://images.unsplash.com/photo-1605980776566-0486c3ac5049?w=500&h=500&fit=crop', // Reused similar texture
    'Modern Shag': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&h=500&fit=crop',
    'Layered': 'https://images.unsplash.com/photo-1596483553887-708d13437153?w=500&h=500&fit=crop',

    // WOMEN - Long
    'Curtain Bangs': 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=500&h=500&fit=crop',
    'Beach Waves': 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&h=500&fit=crop',
    'Waves': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&h=500&fit=crop',
    'Straight': 'https://images.unsplash.com/photo-1551712702-4b7336cd7bcf?w=500&h=500&fit=crop',
    'Butterfly Cut': 'https://images.unsplash.com/photo-1596483553887-708d13437153?w=500&h=500&fit=crop', // Strong layering
    'Jellyfish Cut': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=500&fit=crop', // Creative placeholder
    'V-Cut': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&h=500&fit=crop',
    'U-Cut': 'https://images.unsplash.com/photo-1552697274-1e0e8e454f76?w=500&h=500&fit=crop',
    'Waterfall Layers': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=500&fit=crop',
    'Mermaid Waves': 'https://images.unsplash.com/photo-1519764622345-23439dd774f7?w=500&h=500&fit=crop',

    // WOMEN - Updo
    'Messy Bun': 'https://images.unsplash.com/photo-1606511453303-34433ca78f7e?w=500&h=500&fit=crop',
    'Space Buns': 'https://images.unsplash.com/photo-1522858888062-81dc64483783?w=500&h=500&fit=crop',
    'Low Bun': 'https://images.unsplash.com/photo-1552699609-b7b51e04db73?w=500&h=500&fit=crop',
    'High Bun': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=500&fit=crop',
    'High Ponytail': 'https://images.unsplash.com/photo-1620331313627-802c384615a9?w=500&h=500&fit=crop',
    'Low Ponytail': 'https://images.unsplash.com/photo-1617391851608-5b4850772242?w=500&h=500&fit=crop',
    'Dutch Braids': 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=500&h=500&fit=crop',
    'French Braids': 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&h=500&fit=crop',
    'Braids': 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500&h=500&fit=crop'
  };

  // Check for exact match
  if (map[style]) return map[style];

  // Check for partial match (e.g. "Fade" matches "High Fade")
  for (const k of Object.keys(map)) {
    if (style.includes(k)) return map[k];
  }

  // Default Fallbacks
  return gender === 'Men'
    ? 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&h=500&fit=crop'
    : 'https://images.unsplash.com/photo-1523264626844-323118242244?w=500&h=500&fit=crop';
};

const DATA: any = {
  Men: {
    Short: [
      { label: 'Buzz Cut' }, { label: 'High Fade' }, { label: 'Mid Fade' }, { label: 'Low Fade' },
      { label: 'Drop Fade' }, { label: 'Skin Fade' }, { label: 'Crew Cut' }, { label: 'Caesar Cut' },
      { label: 'Textured Crop' }, { label: 'French Crop' }, { label: 'Ivy League' }, { label: 'Flat Top' },
    ],
    Medium: [
      { label: 'Quiff' }, { label: 'Modern Quiff' }, { label: 'Pompadour' }, { label: 'Side Part' },
      { label: 'Undercut' }, { label: 'Slicked Back' }, { label: 'Faux Hawk' }, { label: 'Messy Fringe' },
      { label: 'Textured Fringe' }, { label: 'Mullet' }
    ],
    Long: [
      { label: 'Man Bun' }, { label: 'Top Knot' }, { label: 'Shoulder Length' }, { label: 'Flow' },
      { label: 'Wolf Cut' }, { label: 'Surfer' }, { label: 'Dreadlocks' }
    ]
  },
  Women: {
    Short: [
      { label: 'Pixie' }, { label: 'Long Pixie' }, { label: 'Textured Pixie' }, { label: 'Undercut Pixie' },
      { label: 'Bob' }, { label: 'French Bob' }, { label: 'Italian Bob' }, { label: 'Box Bob' },
      { label: 'Bowl Cut' }, { label: 'Mixie' }
    ],
    Medium: [
      { label: 'Lob' }, { label: 'Blunt Lob' }, { label: 'Textured Lob' }, { label: 'Shag' },
      { label: 'Modern Shag' }, { label: 'Layered' }, { label: 'Mullet' }, { label: 'Wolf Cut' }
    ],
    Long: [
      { label: 'Curtain Bangs' }, { label: 'Beach Waves' }, { label: 'Straight' }, { label: 'Butterfly Cut' },
      { label: 'Jellyfish Cut' }, { label: 'V-Cut' }, { label: 'U-Cut' }, { label: 'Waterfall Layers' },
      { label: 'Mermaid Waves' }
    ],
    Updo: [
      { label: 'Messy Bun' }, { label: 'Space Buns' }, { label: 'Low Bun' }, { label: 'High Bun' },
      { label: 'High Ponytail' }, { label: 'Low Ponytail' }, { label: 'Dutch Braids' }, { label: 'French Braids' }
    ]
  }
};

const COLORS = [
  { label: 'Keep Natural', hex: 'transparent', icon: Smile },
  { label: 'Natural Black', hex: '#1a1a1a', icon: null },
  { label: 'Dark Brown', hex: '#3b2f2f', icon: null },
  { label: 'Chestnut', hex: '#5d4037', icon: null },
  { label: 'Caramel', hex: '#c68e17', icon: null },
  { label: 'Honey Blonde', hex: '#e1c16e', icon: null },
  { label: 'Platinum', hex: '#f5f5f5', icon: null },
  { label: 'Auburn', hex: '#7a3121', icon: null },
  { label: 'Copper Red', hex: '#b94e48', icon: null },
  { label: 'Burgundy', hex: '#800020', icon: null },
  { label: 'Silver/Grey', hex: '#9e9e9e', icon: null },
  { label: 'Rose Gold', hex: '#b76e79', icon: null },
  { label: 'Pastel Pink', hex: '#f8bbd0', icon: null },
  { label: 'Midnight Blue', hex: '#1a237e', icon: null },
  { label: 'Emerald Green', hex: '#50c878', icon: null },
  { label: 'Lavender', hex: '#e6e6fa', icon: null },
  { label: 'Ash Blonde', hex: '#B2BEB5', icon: null },
  { label: 'Neon Green', hex: '#39ff14', icon: null },
  { label: 'Electric Blue', hex: '#00ffff', icon: null }
];

const PRESETS: PresetStyle[] = [
  { id: '1', label: 'Business Chic', gender: 'Women', category: 'Medium', style: 'Lob', color: 'Dark Brown', description: 'Professional & Sleek' },
  { id: '2', label: 'Surfer Vibe', gender: 'Men', category: 'Long', style: 'Flow', color: 'Honey Blonde', description: 'Relaxed & Wavy' },
  { id: '3', label: 'Parisian', gender: 'Women', category: 'Short', style: 'French Bob', color: 'Natural Black', description: 'Timeless Classic' },
  { id: '4', label: 'Modern Fade', gender: 'Men', category: 'Short', style: 'High Fade', color: 'Keep Natural', description: 'Sharp & Clean' }
];

interface OptionBtnProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  colorHex?: string;
}

const OptionBtn: React.FC<OptionBtnProps> = ({ label, active, onClick, icon: Icon, colorHex }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors group border ${active
      ? 'bg-brand-900 text-white border-brand-900'
      : 'hover:bg-brand-50 border-transparent hover:border-brand-200 text-brand-700'
      }`}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className={`w-4 h-4 ${active ? 'text-brand-300' : 'text-brand-400'}`} />}
      {colorHex && (
        <div className={`w-4 h-4 rounded-full border ${active ? 'border-white/30' : 'border-brand-200'}`} style={{ backgroundColor: colorHex }}></div>
      )}
      <span className="font-medium text-sm">{label}</span>
    </div>
    {active && <Check className="w-4 h-4 text-brand-300" />}
  </button>
);

type ControlType = 'gender' | 'category' | 'style' | 'color' | 'presets' | null;

export const Controls: React.FC<ControlsProps> = ({
  onGenerate, isLoading, onUndo, onRedo, canUndo, canRedo
}) => {
  const [gender, setGender] = useState<string>('Women');
  const [category, setCategory] = useState<string>('Medium');
  const [style, setStyle] = useState<string>('Layered');

  // Color State
  const [colorLabel, setColorLabel] = useState<string>('Keep Natural');
  const [customHex, setCustomHex] = useState<string>('#000000');
  const [isCustomColor, setIsCustomColor] = useState<boolean>(false);
  const [highlightIntensity, setHighlightIntensity] = useState<number>(0);

  const [activeControl, setActiveControl] = useState<ControlType>(null);

  // Sync logic
  useEffect(() => {
    const cats = Object.keys(DATA[gender]);
    if (!cats.includes(category)) setCategory(cats[0]);
  }, [gender]);

  useEffect(() => {
    const styles = DATA[gender][category] || [];
    const styleExists = styles.find((s: any) => s.label === style);
    if (!styleExists) setStyle(styles[0]?.label || '');
  }, [gender, category]);

  const handleGenerateClick = () => {
    let colorPrompt = "";
    let selectedColorValue = colorLabel;
    if (isCustomColor) {
      selectedColorValue = customHex;
    } else if (colorLabel !== 'Keep Natural') {
      selectedColorValue = colorLabel;
    }

    if (selectedColorValue !== 'Keep Natural') {
      if (highlightIntensity > 0) {
        colorPrompt = `Add ${selectedColorValue} colored highlights/strands to the hair (balayage style). Highlight Intensity: ${highlightIntensity}%. Base color remains natural or blends lightly.`;
      } else {
        colorPrompt = `Dye hair color ${selectedColorValue}.`;
      }
    } else {
      colorPrompt = "Keep the original hair color.";
      if (highlightIntensity > 0) {
        colorPrompt += ` Add subtle natural highlights, intensity ${highlightIntensity}%.`;
      }
    }

    const prompt = `A ${gender} hairstyle. ${style} cut, ${category} length. ${colorPrompt} Professional salon look.`;
    onGenerate(prompt, { gender, style, color: selectedColorValue, highlightIntensity });
    setActiveControl(null);
  };

  const applyPreset = (preset: PresetStyle) => {
    setGender(preset.gender);
    setCategory(preset.category);
    setStyle(preset.style);

    const stdColor = COLORS.find(c => c.label === preset.color);
    if (stdColor) {
      setColorLabel(preset.color);
      setIsCustomColor(false);
    } else {
      setColorLabel('Keep Natural');
    }

    setHighlightIntensity(0);
    setActiveControl(null);
  };

  const handleSuggest = () => {
    const genders = Object.keys(DATA);
    const rG = genders[Math.floor(Math.random() * genders.length)];
    const cats = Object.keys(DATA[rG]);
    const rC = cats[Math.floor(Math.random() * cats.length)];
    const styles = DATA[rG][rC];
    const rS = styles[Math.floor(Math.random() * styles.length)].label;
    const rCol = COLORS[Math.floor(Math.random() * COLORS.length)].label;

    setGender(rG);
    setCategory(rC);
    setStyle(rS);
    setColorLabel(rCol);
    setIsCustomColor(false);
    setHighlightIntensity(Math.random() > 0.7 ? 30 : 0);
  };

  const toggleControl = (type: ControlType) => {
    setActiveControl(activeControl === type ? null : type);
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    const s = 100;
    const l = 50;
    const h = hue;
    const sat = s / 100;
    const lig = l / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = sat * Math.min(lig, 1 - lig);
    const f = (n: number) =>
      lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const hexVal = `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;

    setCustomHex(hexVal);
    setIsCustomColor(true);
    setColorLabel('Custom');
  };

  // Popover Rendering Logic
  const renderPopover = () => {
    if (!activeControl) return null;

    let type = activeControl;
    let label = '';
    let content = null;

    // Define content based on type
    switch (type) {
      case 'gender':
        label = 'Gender';
        content = (
          <div className="grid grid-cols-1 gap-1">
            {Object.keys(DATA).map(opt => (
              <OptionBtn key={opt} label={opt} active={gender === opt} onClick={() => { setGender(opt); setActiveControl(null); }} />
            ))}
          </div>
        );
        break;
      case 'category':
        label = 'Length';
        content = (
          <div className="grid grid-cols-1 gap-1">
            {Object.keys(DATA[gender]).map(opt => (
              <OptionBtn key={opt} label={opt} active={category === opt} onClick={() => { setCategory(opt); setActiveControl(null); }} />
            ))}
          </div>
        );
        break;
      case 'style':
        label = 'Style';
        content = (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DATA[gender][category].map((opt: any) => (
              <button
                key={opt.label}
                onClick={() => { setStyle(opt.label); setActiveControl(null); }}
                className={`
                          relative flex flex-col items-center justify-end p-0 rounded-xl border transition-all duration-200 aspect-square gap-3 group overflow-hidden bg-white
                          ${style === opt.label
                    ? 'border-brand-900 shadow-lg scale-[1.02] ring-2 ring-brand-900'
                    : 'border-brand-100 hover:border-brand-300 hover:shadow-md'
                  }
                        `}
              >
                {/* Line Art Simulation using CSS Filters */}
                <img
                  src={getStyleImage(gender, opt.label)}
                  alt={opt.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                  style={{
                    filter: 'grayscale(100%) contrast(200%) brightness(120%)',
                    mixBlendMode: 'multiply'
                  }}
                />
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 bg-[#fdfcf8] opacity-10 mix-blend-multiply pointer-events-none"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent"></div>

                <span className="text-xs font-bold text-center leading-tight px-1 text-brand-900 relative z-10 mb-2">{opt.label}</span>

                {style === opt.label && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-900 text-white flex items-center justify-center shadow-lg z-20">
                    <Check className="w-2 h-2" />
                  </div>
                )}
              </button>
            ))}
          </div>
        );
        break;
      case 'color':
        label = 'Color';
        content = (
          <>
            <div className="flex-none bg-brand-50 border-b border-brand-200">
              <div className="p-4 border-b border-brand-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Custom Shade</span>
                  <div className="w-6 h-6 rounded-full border border-brand-200 shadow-inner" style={{ backgroundColor: customHex }}></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  defaultValue="0"
                  onChange={handleHueChange}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-brand-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Strands Intensity</span>
                  </div>
                  <span className="text-xs font-bold text-brand-900">{highlightIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={highlightIntensity}
                  onChange={(e) => setHighlightIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-brand-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 p-2">
              {COLORS.map(opt => (
                <OptionBtn
                  key={opt.label}
                  label={opt.label}
                  colorHex={opt.hex}
                  active={!isCustomColor && colorLabel === opt.label}
                  onClick={() => { setColorLabel(opt.label); setIsCustomColor(false); setActiveControl(null); }}
                />
              ))}
            </div>
          </>
        );
        break;
      case 'presets':
        label = 'Presets';
        content = (
          <div className="grid grid-cols-1 gap-1">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="p-2 rounded-xl text-left hover:bg-brand-50 transition-colors group border border-transparent hover:border-brand-200 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-brand-100">
                  <img
                    src={getStyleImage(preset.gender, preset.style)}
                    alt={preset.style}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-sm text-brand-900">{preset.label}</span>
                    <span className="text-[10px] bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-full">{preset.gender}</span>
                  </div>
                  <p className="text-[10px] text-brand-500 line-clamp-1">{preset.description}</p>
                </div>
              </button>
            ))}
          </div>
        );
        break;
    }

    return (
      <div className={`absolute bottom-full left-0 w-full mb-4 z-50 animate-slide-up origin-bottom
             ${type === 'style' ? 'sm:w-[420px] sm:left-0' : 'sm:w-[320px] sm:left-0'}
        `}>
        <div className="bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden flex flex-col max-h-[60vh]">
          {/* Dynamic Header */}
          <div className="p-3 bg-brand-50 border-b border-brand-100 flex items-center justify-between sticky top-0 z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Select {label}</span>
              {type === 'style' && <span className="text-[10px] text-brand-400 block mt-0.5">Viewing {category} styles for {gender}</span>}
            </div>
            <button onClick={() => setActiveControl(null)} className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-100 text-brand-500 hover:bg-brand-200 transition-colors">
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>

          {/* Content Scroll Area */}
          <div className={`overflow-y-auto ${type === 'color' ? '' : 'p-2'} bento-scroll`}>
            {content}
          </div>
        </div>
      </div>
    );
  };

  const BentoCell = ({ label, value, icon: Icon, type, customColorHex }: any) => (
    <div className="relative h-full">
      <button
        onClick={() => toggleControl(type)}
        disabled={isLoading}
        className={`w-full h-full text-left p-3 md:p-4 rounded-2xl border transition-all duration-300 group flex flex-col justify-between
          ${activeControl === type
            ? 'bg-brand-800 text-white border-brand-800 shadow-xl scale-[1.02] z-20'
            : 'bg-white text-brand-800 border-brand-200 hover:border-brand-400 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center justify-between mb-1 md:mb-2 w-full">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${activeControl === type ? 'text-brand-300' : 'text-brand-400'}`}>{label}</span>
          <Icon className={`w-4 h-4 ${activeControl === type ? 'text-brand-300' : 'text-brand-400'}`} />
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 overflow-hidden">
            {customColorHex && customColorHex !== 'transparent' && (
              <div className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: customColorHex }}></div>
            )}
            <span className="text-sm md:text-base font-serif font-medium truncate">{value}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${activeControl === type ? 'rotate-180' : ''}`} />
        </div>
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 px-4 pt-4 pb-6 md:pb-8 md:px-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50">
      <div className="max-w-4xl mx-auto flex flex-col gap-3 relative">

        {/* Render Popover Here - Anchored to the container, not inside overflow scroll */}
        {renderPopover()}

        {/* Top Row: Controls - Scrollable on mobile */}
        <div className="flex overflow-x-auto gap-3 pb-2 md:grid md:grid-cols-5 md:pb-0 hide-scrollbar">
          <div className="min-w-[140px] md:min-w-0 h-24 md:h-28"><BentoCell label="Gender" value={gender} icon={User} type="gender" /></div>
          <div className="min-w-[140px] md:min-w-0 h-24 md:h-28"><BentoCell label="Length" value={category} icon={Ruler} type="category" /></div>
          <div className="min-w-[140px] md:min-w-0 h-24 md:h-28"><BentoCell label="Style" value={style} icon={Scissors} type="style" /></div>
          <div className="min-w-[140px] md:min-w-0 h-24 md:h-28">
            <BentoCell
              label="Color"
              value={isCustomColor ? 'Custom' : colorLabel}
              icon={Palette}
              type="color"
              customColorHex={isCustomColor ? customHex : COLORS.find((c: any) => c.label === colorLabel)?.hex}
            />
          </div>
          <div className="min-w-[140px] md:min-w-0 h-24 md:h-28"><BentoCell label="Presets" value="Quick Styles" icon={LayoutTemplate} type="presets" /></div>
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex items-center gap-3">
          <div className="flex bg-brand-50 rounded-2xl p-1 border border-brand-100 shrink-0">
            <button onClick={onUndo} disabled={!canUndo} className="p-3 hover:bg-white rounded-xl disabled:opacity-30 transition-all text-brand-900">
              <Undo2 className="w-5 h-5" />
            </button>
            <button onClick={onRedo} disabled={!canRedo} className="p-3 hover:bg-white rounded-xl disabled:opacity-30 transition-all text-brand-900">
              <Redo2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSuggest}
            disabled={isLoading}
            className="flex items-center justify-center p-3 bg-brand-100 text-brand-600 rounded-2xl hover:bg-brand-200 transition-colors disabled:opacity-50 shrink-0"
            title="Surprise Me"
          >
            <Lightbulb className="w-5 h-5" />
          </button>

          <button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className={`
                    flex-1 h-14 md:h-auto rounded-2xl font-serif text-lg flex items-center justify-center gap-3 shadow-xl transition-all
                    ${isLoading ? 'bg-brand-100 text-brand-400 cursor-not-allowed' : 'bg-brand-900 text-white hover:bg-black hover:scale-[1.02]'}
                `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Crafting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};