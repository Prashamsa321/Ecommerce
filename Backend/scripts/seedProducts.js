import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/product.js'
import Category from '../models/Category.js'

dotenv.config()

const TARGET_COUNT = 100

const ELECTRONIC_CATEGORIES = [
  { name: 'Smartphones', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Tablets', icon: '📲' },
  { name: 'Headphones', icon: '🎧' },
  { name: 'Smart Watches', icon: '⌚' },
  { name: 'Cameras', icon: '📷' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Monitors', icon: '🖥️' },
  { name: 'Accessories', icon: '🔌' },
  { name: 'Audio', icon: '🔊' },
]

const ALLOWED_CATEGORY_NAMES = new Set(ELECTRONIC_CATEGORIES.map((c) => c.name))

const SOURCE_CATEGORY_SLUGS = [
  'smartphones',
  'laptops',
  'tablets',
  'mobile-accessories',
  'mens-watches',
  'womens-watches',
]

const BLOCKED_CATEGORY_PATTERN =
  /grocer|furniture|beauty|fragrance|skin-care|home-decoration|womens-dresses|mens-shirts|womens-bags|womens-shoes|mens-shoes|womens-jewellery|sunglasses|tops|vehicle|automotive|motorcycle|lighting|sports-accessories|kitchen-accessories/

const CATEGORY_SLUG_MAP = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  tablets: 'Tablets',
  'mobile-accessories': 'Accessories',
  'mens-watches': 'Smart Watches',
  'womens-watches': 'Smart Watches',
}

const VARIANT_SUFFIXES = [
  { suffix: '128GB', priceDelta: 0 },
  { suffix: '256GB', priceDelta: 75 },
  { suffix: '512GB', priceDelta: 150 },
  { suffix: 'Black', priceDelta: 0 },
  { suffix: 'Silver', priceDelta: 25 },
  { suffix: 'Pro Max', priceDelta: 180 },
  { suffix: 'Plus', priceDelta: 120 },
  { suffix: 'Ultra', priceDelta: 220 },
  { suffix: '2024 Edition', priceDelta: 90 },
  { suffix: 'Bundle Pack', priceDelta: 60 },
]

const fetchJson = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json()
}

const getImages = (item) => {
  const images = (item.images || []).filter(Boolean)
  const thumbnail = item.thumbnail
  const merged =
    thumbnail && !images.includes(thumbnail) ? [thumbnail, ...images] : images.length ? images : thumbnail ? [thumbnail] : []
  return [...new Set(merged)].slice(0, 4)
}

const mapCategory = (rawCategory, title) => {
  const key = (rawCategory || '').toLowerCase()
  const text = `${title} ${key}`.toLowerCase()

  if (CATEGORY_SLUG_MAP[key]) return CATEGORY_SLUG_MAP[key]

  if (/headphone|earbud|airpod|earphone|beats|headset/.test(text)) return 'Headphones'
  if (/speaker|echo|homepod|soundbar|sound link|audio system/.test(text)) return 'Audio'
  if (/monopod|selfie|camera pedestal|tripod|dslr|lens|canon|sony alpha|camera/.test(text)) return 'Cameras'
  if (/monitor|display|odyssey|ultrawide|screen panel/.test(text)) return 'Monitors'
  if (/game|console|controller|playstation|xbox|gaming|rog/.test(text)) return 'Gaming'
  if (/phone|iphone|samsung galaxy|pixel|oppo|realme|vivo|mobile/.test(text)) return 'Smartphones'
  if (/laptop|macbook|notebook|chromebook|zenbook|matebook|xps|yoga/.test(text)) return 'Laptops'
  if (/tablet|ipad|galaxy tab/.test(text)) return 'Tablets'
  if (/watch|smartwatch|rolex|longines|iwc/.test(text)) return 'Smart Watches'

  return 'Accessories'
}

const isBlockedItem = (item) => BLOCKED_CATEGORY_PATTERN.test(`${item.category} ${item.title}`.toLowerCase())

const toProduct = (item) => {
  if (isBlockedItem(item)) return null

  const images = getImages(item)
  if (!images.length) return null

  const category = mapCategory(item.category, item.title)
  if (!ALLOWED_CATEGORY_NAMES.has(category)) return null

  return {
    name: item.title.trim(),
    description:
      item.description?.trim() ||
      `${item.title} — premium ${category.toLowerCase()} with reliable performance and modern design.`,
    price: Math.round((item.price || 99) * 100) / 100,
    category,
    images,
    stock: Math.floor(Math.random() * 80) + 10,
  }
}

const collectElectronicsFromDummyJson = async () => {
  const seen = new Set()
  const products = []

  const addItem = (item) => {
    if (!item?.title || seen.has(item.title)) return
    const product = toProduct(item)
    if (!product) return
    seen.add(item.title)
    products.push(product)
  }

  for (const slug of SOURCE_CATEGORY_SLUGS) {
    try {
      const data = await fetchJson(`https://dummyjson.com/products/category/${slug}?limit=100`)
      for (const item of data.products || []) addItem(item)
    } catch (err) {
      console.warn(`Category fetch skipped (${slug}):`, err.message)
    }
  }

  const searches = [
    'smartphone', 'iphone', 'samsung phone', 'laptop', 'macbook', 'tablet', 'ipad',
    'headphone', 'earbuds', 'airpods', 'watch', 'smart watch', 'camera', 'monitor',
    'gaming laptop', 'speaker', 'bluetooth', 'wireless charger', 'power bank',
    'keyboard', 'mouse', 'router', 'webcam', 'ssd', 'graphics card',
  ]

  for (const query of searches) {
    if (products.length >= TARGET_COUNT) break
    try {
      const data = await fetchJson(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=30`
      )
      for (const item of data.products || []) addItem(item)
    } catch (err) {
      console.warn(`Search fetch skipped (${query}):`, err.message)
    }
  }

  return products
}

const pickImageFromPool = (pool, existing) => {
  const sourcePool = pool?.length ? pool : existing
  const source = sourcePool[Math.floor(Math.random() * sourcePool.length)]
  return source
}

const ensureBaseCategoryProducts = async (products) => {
  const byCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  const seen = new Set(products.map((p) => p.name.toLowerCase()))

  if (!byCategory.Laptops) {
    try {
      const data = await fetchJson('https://dummyjson.com/products/category/laptops?limit=20')
      for (const item of data.products || []) {
        if (seen.has(item.title.toLowerCase())) continue
        const product = toProduct(item)
        if (!product || product.category !== 'Laptops') continue
        seen.add(product.name.toLowerCase())
        products.push(product)
      }
    } catch (err) {
      console.warn('Laptop fetch skipped:', err.message)
    }
  }

  return products
}

const buildCategoryFillers = (existing) => {
  const byCategory = existing.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || []
    acc[product.category].push(product)
    return acc
  }, {})

  const pickImage = (category, fallbackCategory = 'Smartphones') => {
    const source = pickImageFromPool(byCategory[category], byCategory[fallbackCategory] || existing)
    return source
  }

  const fillers = [
    { name: 'Apple MacBook Pro 14 M3', category: 'Laptops', base: 'Laptops' },
    { name: 'Dell XPS 13 Plus Laptop', category: 'Laptops', base: 'Laptops' },
    { name: 'Lenovo Yoga Slim Laptop', category: 'Laptops', base: 'Laptops' },
    { name: 'ASUS Zenbook Pro Laptop', category: 'Laptops', base: 'Laptops' },
    { name: 'Huawei MateBook X Pro Laptop', category: 'Laptops', base: 'Laptops' },
    { name: 'ASUS ROG Strix Gaming Laptop', category: 'Gaming', base: 'Laptops' },
    { name: 'Lenovo Legion Gaming Laptop', category: 'Gaming', base: 'Laptops' },
    { name: 'MSI Raider Gaming Laptop', category: 'Gaming', base: 'Laptops' },
    { name: 'Acer Predator Gaming Laptop', category: 'Gaming', base: 'Laptops' },
    { name: 'Razer Blade Gaming Laptop', category: 'Gaming', base: 'Laptops' },
    { name: 'Samsung Odyssey G7 Monitor', category: 'Monitors', base: 'Laptops' },
    { name: 'LG UltraFine 27 Monitor', category: 'Monitors', base: 'Tablets' },
    { name: 'Dell UltraSharp 32 Monitor', category: 'Monitors', base: 'Laptops' },
    { name: 'BenQ MOBIUZ Gaming Monitor', category: 'Monitors', base: 'Laptops' },
    { name: 'ASUS ProArt Display Monitor', category: 'Monitors', base: 'Tablets' },
    { name: 'Canon EOS Mirrorless Camera', category: 'Cameras', base: 'Cameras' },
    { name: 'Sony Alpha Mirrorless Camera', category: 'Cameras', base: 'Cameras' },
    { name: 'Nikon Z Series Camera', category: 'Cameras', base: 'Cameras' },
    { name: 'GoPro Action Camera', category: 'Cameras', base: 'Cameras' },
    { name: 'DJI Pocket Camera', category: 'Cameras', base: 'Cameras' },
    { name: 'Bose QuietComfort Headphones', category: 'Headphones', base: 'Headphones' },
    { name: 'Sony WH-1000XM5 Headphones', category: 'Headphones', base: 'Headphones' },
    { name: 'JBL Tune Wireless Headphones', category: 'Headphones', base: 'Headphones' },
    { name: 'Sennheiser HD Headphones', category: 'Headphones', base: 'Headphones' },
    { name: 'Marshall Major IV Headphones', category: 'Headphones', base: 'Headphones' },
    { name: 'JBL Charge Bluetooth Speaker', category: 'Audio', base: 'Audio' },
    { name: 'Sony SRS Portable Speaker', category: 'Audio', base: 'Audio' },
    { name: 'Bose SoundLink Speaker', category: 'Audio', base: 'Audio' },
    { name: 'Sonos One Smart Speaker', category: 'Audio', base: 'Audio' },
    { name: 'Anker Soundcore Speaker', category: 'Audio', base: 'Audio' },
    { name: 'USB-C Fast Charging Hub', category: 'Accessories', base: 'Accessories' },
    { name: 'MagSafe Wireless Charger Stand', category: 'Accessories', base: 'Accessories' },
    { name: 'Bluetooth Keyboard Combo', category: 'Accessories', base: 'Accessories' },
    { name: 'Portable SSD 1TB Drive', category: 'Accessories', base: 'Accessories' },
    { name: 'Smart Wi-Fi Router', category: 'Accessories', base: 'Accessories' },
  ]

  const created = []
  for (const filler of fillers) {
    const source = pickImage(filler.base, 'Smartphones')
    if (!source?.images?.[0]) continue

    const images = [...source.images.slice(0, 2)]

    created.push({
      name: filler.name,
      description: `${filler.name} — high-quality ${filler.category.toLowerCase()} built for everyday performance.`,
      price: Math.round(((source.price || 199) + Math.floor(Math.random() * 120)) * 100) / 100,
      category: filler.category,
      images,
      stock: Math.floor(Math.random() * 80) + 10,
    })
  }

  return created
}

const expandWithVariants = (products, targetCount) => {
  const result = [...products]
  const seen = new Set(products.map((p) => p.name.toLowerCase()))

  // Prefer adding variants to high-volume categories, but keep base products intact.
  const bases = [...products].sort((a, b) => {
    const priority = { Laptops: 0, Smartphones: 1, Tablets: 2, Headphones: 3, Audio: 4 }
    return (priority[a.category] ?? 5) - (priority[b.category] ?? 5)
  })

  let variantIndex = 0
  while (result.length < targetCount) {
    const base = bases[variantIndex % bases.length]
    const variant = VARIANT_SUFFIXES[Math.floor(variantIndex / bases.length) % VARIANT_SUFFIXES.length]
    const name = `${base.name} ${variant.suffix}`.trim()

    if (!seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase())
      result.push({
        ...base,
        name,
        price: Math.round((base.price + variant.priceDelta) * 100) / 100,
        stock: Math.floor(Math.random() * 80) + 10,
      })
    }

    variantIndex += 1
    if (variantIndex > bases.length * VARIANT_SUFFIXES.length * 4) break
  }

  return result.slice(0, targetCount)
}

const seedCategories = async () => {
  for (const cat of ELECTRONIC_CATEGORIES) {
    await Category.findOneAndUpdate(
      { name: cat.name },
      { name: cat.name, icon: cat.icon },
      { upsert: true, new: true, setDefaultsOnInsert: true, returnDocument: 'after' }
    )
  }
}

const seed = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/test'

  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')

    await seedCategories()
    console.log(`Seeded ${ELECTRONIC_CATEGORIES.length} electronic categories`)

    let products = await collectElectronicsFromDummyJson()
    console.log(`Collected ${products.length} verified electronics from DummyJSON`)

    products = await ensureBaseCategoryProducts(products)
    console.log(`Ensured base categories, now ${products.length} products`)

    const fillers = buildCategoryFillers(products)
    const fillerNames = new Set(products.map((p) => p.name.toLowerCase()))
    for (const filler of fillers) {
      if (fillerNames.has(filler.name.toLowerCase())) continue
      products.push(filler)
      fillerNames.add(filler.name.toLowerCase())
    }
    console.log(`Added ${fillers.length} category-balanced electronics`)

    products = expandWithVariants(products, TARGET_COUNT)
    console.log(`Prepared ${products.length} total electronic products`)

    await Product.deleteMany({})
    const inserted = await Product.insertMany(products)

    const categoryCounts = inserted.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})

    console.log(`Seeded ${inserted.length} electronic products`)
    console.log('Products per category:', categoryCounts)
    console.log('Sample product:', {
      name: inserted[0].name,
      category: inserted[0].category,
      image: inserted[0].images?.[0],
    })

    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
