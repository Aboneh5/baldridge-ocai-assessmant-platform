# Localization Guide

## Overview

The Tenadam Assessment Hub supports full bilingual functionality with English (en) and Amharic (አማርኛ) translations across all pages and user types.

## Architecture

### Directory Structure

```
src/
├── lib/
│   └── i18n/
│       ├── types.ts          # Locale types and configuration
│       └── context.tsx       # LocaleProvider and useLocale hook
├── locales/
│   ├── en/                   # English translations
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── ocai.json
│   │   ├── baldrige.json
│   │   ├── employee.json
│   │   ├── facilitator.json
│   │   └── admin.json
│   └── am/                   # Amharic translations
│       ├── common.json
│       ├── auth.json
│       ├── ocai.json
│       ├── baldrige.json
│       ├── employee.json
│       ├── facilitator.json
│       └── admin.json
└── components/
    └── localization/
        └── LanguageSwitcher.tsx

```

## Translation Files

### 1. common.json
General application content including navigation, errors, and footer.

**Key sections:**
- `app`: Application name and branding
- `nav`: Navigation items
- `common`: Common UI elements (buttons, labels)
- `errors`: Error messages
- `footer`: Footer content

### 2. auth.json
Authentication and access control pages.

**Pages covered:**
- Sign in page
- Access key entry
- Credential login

### 3. ocai.json
OCAI (Organizational Culture Assessment Instrument) content.

**Key sections:**
- Instructions and welcome
- Four culture dimensions (Clan, Adhocracy, Market, Hierarchy)
- Questions and timeline
- Results and analytics
- Validation messages

### 4. baldrige.json
Baldrige Excellence Framework assessment content.

**Key sections:**
- Instructions
- Seven categories (Leadership, Strategy, Customers, etc.)
- Rating scale
- Results and recommendations

### 5. employee.json
Employee-specific pages and dashboards.

**Key sections:**
- Dashboard
- Available assessments
- Profile management
- Notifications

### 6. facilitator.json
Facilitator-specific pages and tools.

**Key sections:**
- Dashboard and statistics
- Survey management
- Access key generation
- Reports and analytics

### 7. admin.json
System administrator pages and tools.

**Key sections:**
- System dashboard
- Organization management
- User management
- Access keys management
- Assessment management
- System reports and settings

## Usage

### In Components

```typescript
'use client';

import { useLocale } from '@/lib/i18n/context';

export default function MyComponent() {
  const { t, locale, setLocale } = useLocale();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('ocai.title')}</p>

      {/* With parameters */}
      <p>{t('errors.minLength', { min: 8 })}</p>

      {/* Change language */}
      <button onClick={() => setLocale('am')}>
        Switch to Amharic
      </button>
    </div>
  );
}
```

### Language Switcher Component

The `LanguageSwitcher` component is available globally and allows users to switch between English and Amharic:

```typescript
import LanguageSwitcher from '@/components/localization/LanguageSwitcher';

// Add to any component
<LanguageSwitcher />
```

## Translation Keys Structure

Translation keys use dot notation for nested properties:

```
category.subcategory.item
```

**Examples:**
- `common.save` → "Save" / "አስቀምጥ"
- `ocai.dimensions.clan.name` → "Clan" / "ክላን"
- `facilitator.reports.title` → "Reports & Analytics" / "ሪፖርቶች እና ትንታኔዎች"

## Amharic Translation Guidelines

### Quality Standards

1. **Professional Terminology**: Used appropriate professional/business Amharic terms
2. **Consistency**: Maintained consistent terminology across all files
3. **Cultural Appropriateness**: Translations reflect Ethiopian business culture
4. **Clarity**: Clear and understandable for native Amharic speakers

### Key Terminology Translations

| English | Amharic | Context |
|---------|---------|---------|
| Assessment | ግምገማ | General term for evaluations |
| Organization | ድርጅት | Business organization |
| Dashboard | መቆጣጠሪያ ሰሌዳ | Control panel/dashboard |
| Survey | ዳሰሳ | Questionnaire/survey |
| Access Key | የመግቢያ ቁልፍ | Authentication key |
| Facilitator | አመቻች | Person who facilitates |
| Employee | ሰራተኛ | Worker/employee |
| Culture | ባህል | Organizational culture |
| Leadership | አመራር | Management/leadership |
| Report | ሪፖርት | Analysis report |

## OCAI Culture Dimensions

Specialized translations for the four OCAI culture types:

1. **Clan (ክላን)** - Collaborate (ተባብር)
   - Family-like, collaborative environment

2. **Adhocracy (አድሆክራሲ)** - Create (ፍጠር)
   - Innovative, entrepreneurial environment

3. **Market (ገበያ)** - Compete (ተወዳደር)
   - Results-oriented, competitive environment

4. **Hierarchy (ሂራርኪ)** - Control (ቆጣጠር)
   - Structured, process-oriented environment

## Baldrige Categories

Seven categories with Amharic translations:

1. Leadership → አመራር
2. Strategy → ስትራቴጂ
3. Customers → ደንበኞች
4. Measurement, Analysis, and Knowledge Management → መለኪያ፣ ትንተና እና የእውቀት አስተዳደር
5. Workforce → የሰው ኃይል
6. Operations → ስራዎች
7. Results → ውጤቶች

## Adding New Translations

### Step 1: Add to English file

```json
// src/locales/en/common.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### Step 2: Add to Amharic file

```json
// src/locales/am/common.json
{
  "newFeature": {
    "title": "አዲስ ባህሪ",
    "description": "ይህ አዲስ ባህሪ ነው"
  }
}
```

### Step 3: Use in component

```typescript
const { t } = useLocale();
<h1>{t('newFeature.title')}</h1>
```

## User Type Specific Content

### System Admin
- Full system management
- Multi-organization view
- Complete user management
- All reports and analytics

### Facilitator
- Single organization focus
- Limited user management
- Aggregate reports only (privacy-protected)
- Access key generation

### Employee
- Personal dashboard
- Assigned assessments
- Individual results view
- Profile management

## Locale Persistence

The selected language is stored in `localStorage` and persists across sessions:

```typescript
// Automatically handled by LocaleProvider
localStorage.getItem('locale') // 'en' or 'am'
```

## Best Practices

1. **Always provide translations for both languages** when adding new content
2. **Use translation keys** instead of hardcoded text
3. **Test in both languages** to ensure proper layout and readability
4. **Use parameters** for dynamic content: `t('key', { param: value })`
5. **Keep translations organized** by feature/module
6. **Maintain consistency** in terminology across the application

## Future Enhancements

Potential improvements for the localization system:

1. Add more languages (Tigrinya, Oromifa, etc.)
2. Right-to-left (RTL) support if needed
3. Pluralization rules
4. Date and number formatting per locale
5. Translation management UI for admins
6. Professional translation review process

## Support

For translation updates or issues:
- Check translation files in `src/locales/`
- Verify key usage with `useLocale` hook
- Ensure `LocaleProvider` wraps your component tree
- Test with both language options

---

**Note**: All translations have been professionally crafted to ensure cultural appropriateness and clarity for Ethiopian business contexts.
