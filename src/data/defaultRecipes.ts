import type { Recipe } from '../types';

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'recipe-1',
    title: '經典台式滷肉飯',
    coverImage: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80',
    description: '香噴噴的香菇肥美滷肉，搭配熱騰騰的白飯，是台灣最經典的家鄉美味。',
    difficulty: 'medium',
    cookTime: 60,
    servings: 4,
    tags: ['中式', '午晚餐', '經典'],
    createdAt: '2026-08-20',
    author: '新手廚娘小花',
    likesCount: 24,
    likedBy: ['美食探險家阿明'],
    ingredients: [
      { name: '五花肉條', amount: 600, unit: '克' },
      { name: '紅蔥頭酥', amount: 50, unit: '克' },
      { name: '香菇(泡軟切丁)', amount: 6, unit: '朵' },
      { name: '醬油', amount: 100, unit: '毫升' },
      { name: '冰糖', amount: 30, unit: '克' },
      { name: '米酒', amount: 50, unit: '毫升' },
      { name: '水', amount: 800, unit: '毫升' },
      { name: '白飯', amount: 4, unit: '碗' }
    ],
    steps: [
      {
        instruction: '熱鍋不放油，放入五花肉條中火煸炒至表面微焦、逼出多餘油脂。',
        image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '加入香菇丁炒香，接著加入冰糖炒至融化呈微黃色（糖色）。',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '淋入米酒與醬油翻炒，讓肉均勻上色與吸收醬香。',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '加入水與紅蔥頭酥，大火煮滾後轉小火，蓋上鍋蓋慢燉 45-50 分鐘至肉質軟爛。',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '將濃郁的滷肉淋在熱騰騰的白飯上即可享用！'
      }
    ],
    isFavorite: true,
    comments: [
      {
        id: 'c1',
        author: '阿明師',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
        content: '這個滷肉飯配方比例太棒了，燉出來的肉入口即化，香氣十足！',
        createdAt: '2026-08-21 12:00'
      }
    ]
  },
  {
    id: 'recipe-2',
    title: '法式熔岩巧克力蛋糕',
    coverImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: '外皮酥脆、內部濃郁流心的經典法式甜點，製作過程簡單卻極具視覺與味覺驚喜。',
    difficulty: 'easy',
    cookTime: 15,
    servings: 2,
    tags: ['烘焙', '甜點', '15分鐘料理'],
    createdAt: '2026-08-21',
    author: '烘焙達人莉莉',
    likesCount: 18,
    likedBy: [],
    ingredients: [
      { name: '黑巧克力(70%)', amount: 100, unit: '克' },
      { name: '無鹽奶油', amount: 80, unit: '克' },
      { name: '雞蛋', amount: 2, unit: '顆' },
      { name: '細砂糖', amount: 30, unit: '克' },
      { name: '低筋麵粉', amount: 30, unit: '克' }
    ],
    steps: [
      {
        instruction: '黑巧克力與無鹽奶油隔水加熱融化，攪拌至滑順後稍微放涼。',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '在碗中打入雞蛋，加入細砂糖用打蛋器打至顏色微白、起泡。',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '將融化的巧克力奶油液緩緩倒入蛋液中，攪拌均勻。',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '篩入低筋麵粉，用刮刀輕輕翻拌至無粉粒狀態即可。',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '倒入抹了奶油並灑了薄粉的模具中，烤箱預熱 200°C 烘烤 8-10 分鐘，出爐後稍放涼脫模。'
      }
    ],
    isFavorite: false,
    comments: []
  },
  {
    id: 'recipe-3',
    title: '輕盈酪梨水波蛋吐司',
    coverImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    description: '富含優質脂肪與蛋白質的完美健康早餐，只需10分鐘，帶來整天滿滿的元氣！',
    difficulty: 'easy',
    cookTime: 10,
    servings: 1,
    tags: ['早餐', '西式', '10分鐘料理'],
    createdAt: '2026-08-19',
    author: '美食探險家阿明',
    likesCount: 12,
    likedBy: ['新手廚娘小花'],
    ingredients: [
      { name: '全麥吐司', amount: 1, unit: '片' },
      { name: '熟酪梨', amount: 0.5, unit: '個' },
      { name: '雞蛋', amount: 1, unit: '顆' },
      { name: '檸檬汁', amount: 5, unit: '毫升' },
      { name: '鹽與黑胡椒', amount: 1, unit: '適量' },
      { name: '辣椒粉(選用)', amount: 1, unit: '少許' }
    ],
    steps: [
      {
        instruction: '將酪梨肉挖出，加入檸檬汁、鹽、黑胡椒，用叉子壓碎成帶有顆粒的酪梨泥。'
      },
      {
        instruction: '全麥吐司放入烤麵包機或平底鍋烤至兩面金黃酥脆。',
        image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '鍋中裝水煮微滾（冒小泡），加入一匙白醋。攪拌出漩渦後打入雞蛋，小火煮約 3 分鐘至蛋清凝固，撈出備用。',
        image: 'https://images.unsplash.com/photo-1582722418905-24377a954043?auto=format&fit=crop&w=400&q=80'
      },
      {
        instruction: '在烤好的吐司上抹上滿滿的酪梨泥，放上水波蛋，灑上少許辣椒粉與黑胡椒點綴即可開動！'
      }
    ],
    isFavorite: false,
    comments: [
      {
        id: 'c2',
        author: '健身狂人',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria',
        content: '太健康了！加一點點辣椒粉是靈魂，每天早餐吃都不會膩！',
        createdAt: '2026-08-20 08:30'
      }
    ]
  }
];
