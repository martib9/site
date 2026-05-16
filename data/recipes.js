export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
];

export const STORAGE_KEYS = {
  customRecipes: 'martib_recipes_custom',
  cookedRecipes: 'martib_recipes_cooked',
  weekPlan: 'martib_week_plan',
};

export const SECTION_ORDER = [
  "Breakfasts & Brunch",
  "Lunches & Dinners: Chicken / Turkey",
  "Lunches & Dinners: Fish / Seafood",
  "Lunches & Dinners: Beef / Meat",
  "Lunches & Dinners: Vegetarian / Tofu / Cheese",
  "Pasta / Noodles / Rice / Bowls",
  "Soups",
  "Salads",
  "Sandwiches / Wraps / Snacks",
  "Sides / Appetizers / Sauces",
  "Desserts & Baking"
];

export const INITIAL_WEEK_PLAN = {
  "breakfast": [
    "творожники-на-рисовои-муке-https-www-instagram-com-ree",
    "завтрачныи-пирог-https-www-instagram-com-reels-dww4-ck"
  ],
  "lunch": [
    "картофельныи-киш-https-www-instagram-com-reels-dw9ftcp",
    "тунцовая-паста-https-www-instagram-com-p-duxvytlic7d",
    "тофу-рис-https-cooking-nytimes-com-recipes-1027269-i-c",
    "oven-roasted-chicken-shawarma-https-cooking-nytimes-co"
  ],
  "dinner": [
    "spanakopita-https-www-instagram-com-reels-dvsrvmjtyft",
    "chicken-salad-https-cooking-nytimes-com-recipes-101821",
    "chicken-pizza-https-www-instagram-com-reels-dw1dy4aiom",
    "crispy-halloumi-https-cooking-nytimes-com-recipes-1026"
  ]
};

export const SEED_RECIPES = [
  {
    "id": "завтрачныи-пирог-https-www-instagram-com-reels-dww4-ck",
    "name": "Завтрачный пирог",
    "url": "https://www.instagram.com/reels/DWw4_cKCHDB/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "творожники-на-рисовои-муке-https-www-instagram-com-ree",
    "name": "Творожники на рисовой муке",
    "url": "https://www.instagram.com/reels/DWoK-4qjKDZ/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "scrambled-egg-pancetta-silky-scrambled-eggs-with-pance",
    "name": "Scrambled Egg Pancetta / Silky Scrambled Eggs With Pancetta",
    "url": "https://cooking.nytimes.com/recipes/1023032-silky-scrambled-eggs-with-pancetta-pepper-and-pecorino",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "овсянка-в-духовке-https-t-me-pomadnaa-3944",
    "name": "Овсянка в духовке",
    "url": "https://t.me/pomadnaa/3944",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "breakfast-muffin-https-www-instagram-com-reels-dtc0ff5",
    "name": "Breakfast Muffin",
    "url": "https://www.instagram.com/reels/DTc0fF5jIL4/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "японские-панкеики-https-www-youtube-com-watch-v-ralzxz",
    "name": "Японские панкейки",
    "url": "https://www.youtube.com/watch?v=RaLzxZryEoA",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "сырники-https-www-instagram-com-reel-c8l-2o6i8uu",
    "name": "Сырники",
    "url": "https://www.instagram.com/reel/C8l-2O6i8Uu/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "пицца-из-слоеного-теста-https-www-instagram-com-reel-c",
    "name": "пицца из слоеного теста",
    "url": "https://www.instagram.com/reel/CzizqWjL4jr/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "томатная-овсянка-https-www-instagram-com-reel-cyfq3e3l",
    "name": "Томатная овсянка",
    "url": "https://www.instagram.com/reel/Cyfq3E3LjlI/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": false
  },
  {
    "id": "overnight-oats-https-cooking-nytimes-com-recipes-10195",
    "name": "Overnight oats",
    "url": "https://cooking.nytimes.com/recipes/1019516-overnight-oats",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": true
  },
  {
    "id": "egg-mayo-toast-https-www-instagram-com-reels-dtxvdv8cg",
    "name": "Egg Mayo Toast",
    "url": "https://www.instagram.com/reels/DTxVDv8CGQe/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": true
  },
  {
    "id": "оладьи-https-www-instagram-com-reel-dt77blgdnyo",
    "name": "Оладьи",
    "url": "https://www.instagram.com/reel/DT77BLgDNyO/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": true
  },
  {
    "id": "запеченныи-омлет-с-овощами-https-www-instagram-com-ree",
    "name": "Запечённый омлет с овощами",
    "url": "https://www.instagram.com/reel/DFj0LMSoLsK/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": true
  },
  {
    "id": "бутерброд-с-яицом-https-www-instagram-com-reel-djoay3g",
    "name": "Бутерброд с яйцом",
    "url": "https://www.instagram.com/reel/DJOay3GI-uw/",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": true
  },
  {
    "id": "ватрушки-https-t-me-mashastories1-3129",
    "name": "Ватрушки",
    "url": "https://t.me/mashastories1/3129",
    "section": "Breakfasts & Brunch",
    "defaultMealType": "breakfast",
    "cooked": true
  },
  {
    "id": "lemon-chicken-https-cooking-nytimes-com-recipes-102265",
    "name": "Lemon Chicken",
    "url": "https://cooking.nytimes.com/recipes/1022656-double-lemon-chicken",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "oven-roasted-chicken-shawarma-https-cooking-nytimes-co",
    "name": "Oven-Roasted Chicken Shawarma",
    "url": "https://cooking.nytimes.com/recipes/1017161-oven-roasted-chicken-shawarma",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "chicken-salad-https-cooking-nytimes-com-recipes-101821",
    "name": "Chicken Salad",
    "url": "https://cooking.nytimes.com/recipes/1018211-best-chicken-salad",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "chicken-pizza-https-www-instagram-com-reels-dw1dy4aiom",
    "name": "Chicken pizza",
    "url": "https://www.instagram.com/reels/DW1dy4AiOMf/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "noodles-with-chicken-and-veg-https-www-instagram-com-r",
    "name": "Noodles with chicken and veg",
    "url": "https://www.instagram.com/reel/DVEiMFgD4cl/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "street-corn-chicken-bowl-https-www-instagram-com-p-dt1",
    "name": "Street corn chicken bowl",
    "url": "https://www.instagram.com/p/DT1HtbKj2oa/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "белковыи-куриныи-пирог-https-www-instagram-com-reel-dv",
    "name": "Белковый куриный пирог",
    "url": "https://www.instagram.com/reel/DVBC2bSCMwC/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "вок-но-масла-меньше-https-www-instagram-com-p-dioxltno",
    "name": "Вок, но масла меньше",
    "url": "https://www.instagram.com/p/DIOXlTNo8wP/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "птитим-с-куриным-фаршем-орзо-https-www-instagram-com-r",
    "name": "Птитим с куриным фаршем / орзо",
    "url": "https://www.instagram.com/reel/DTPkOMFiEw1/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "острая-куриная-арахисовые-noodles-https-www-instagram-",
    "name": "Острая куриная арахисовые noodles",
    "url": "https://www.instagram.com/reels/DULp6EtiMlb/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "тефтели-https-www-instagram-com-reel-dujem6sjca8",
    "name": "Тефтели",
    "url": "https://www.instagram.com/reel/DUJem6sjca8/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "шаурма-https-www-instagram-com-reel-ducgq5nki5h",
    "name": "Шаурма",
    "url": "https://www.instagram.com/reel/DUCGQ5nki5H/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриныи-салат-https-www-instagram-com-reel-drfx03fjf6",
    "name": "Куриный салат",
    "url": "https://www.instagram.com/reel/DRFX03fjf6-/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "chicken-piccata-https-cooking-nytimes-com-recipes-7664",
    "name": "Chicken Piccata",
    "url": "https://cooking.nytimes.com/recipes/766425516-chicken-piccata-pasta",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "баттер-чикен-https-www-instagram-com-reel-diwlve3ydz1",
    "name": "Баттер чикен",
    "url": "https://www.instagram.com/reel/DIwLVE3ydZ1/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриные-индеика-котлеты-с-сыром-https-chatgpt-com-shar",
    "name": "Куриные / индейка котлеты с сыром",
    "url": "https://chatgpt.com/share/6898d866-a928-8011-b304-d6691cdcc068",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "капрэзе-сэндвич-https-butterhand-com-caprese-chicken-s",
    "name": "Капрэзе сэндвич",
    "url": "https://butterhand.com/caprese-chicken-sandwich/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриные-кармашки-https-www-instagram-com-reel-dh8bv4qt",
    "name": "Куриные кармашки",
    "url": "https://www.instagram.com/reel/DH8BV4qtlMi/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "паста-с-куриным-фаршем-one-skillet-cheesy-ground-chick",
    "name": "Паста с куриным фаршем — One-Skillet Cheesy Ground Chicken Pasta",
    "url": "",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриные-котлеты-в-духовке-с-рисом-https-www-instagram-",
    "name": "Куриные котлеты в духовке с рисом",
    "url": "https://www.instagram.com/reel/C9DBVGeCliF/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "chicken-stew-https-www-instagram-com-reel-c0jatpuuhp5",
    "name": "Chicken Stew",
    "url": "https://www.instagram.com/reel/C0jatPuuHp5/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "chicken-enchilada-https-www-instagram-com-reel-c0sjiel",
    "name": "Chicken Enchilada",
    "url": "https://www.instagram.com/reel/C0SjIeLOhU2/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "lemon-pepper-chicken-tenders-https-www-instagram-com-r",
    "name": "Lemon Pepper Chicken Tenders",
    "url": "https://www.instagram.com/reel/CyoGXBToUC1/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "сливочныи-суп-с-курицеи-https-www-instagram-com-p-cj5h",
    "name": "Сливочный суп с курицей",
    "url": "https://www.instagram.com/p/Cj5hpsyM3Uh/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриныи-рис-https-www-instagram-com-reel-cylu8o0ou5w",
    "name": "Куриный рис",
    "url": "https://www.instagram.com/reel/CyLU8o0ou5w/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриная-котлета-с-пюре-https-www-instagram-com-reel-c0",
    "name": "Куриная котлета с пюре",
    "url": "https://www.instagram.com/reel/C0rDATYsbk9/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриныи-гратен-https-www-instagram-com-p-ctjrbsrppuw",
    "name": "Куриный гратен",
    "url": "https://www.instagram.com/p/CtJRbsRPpUw/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "запеченная-беиби-картошка-и-курица-https-cooking-nytim",
    "name": "Запеченная бейби-картошка и курица",
    "url": "https://cooking.nytimes.com/recipes/1025628-paprika-chicken-and-potatoes",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "куриные-котлеты-https-www-instagram-com-p-c5bw5-ycp4s",
    "name": "Куриные котлеты",
    "url": "https://www.instagram.com/p/C5BW5_yCP4s/",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "honey-bbq-chicken-mac-cheese-https-vt-tiktok-com-zs8kj",
    "name": "Honey BBQ Chicken Mac & Cheese",
    "url": "https://vt.tiktok.com/ZS8Kj1nYx",
    "section": "Lunches & Dinners: Chicken / Turkey",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "красная-рыба-в-иогурте-https-cooking-nytimes-com-recip",
    "name": "Красная рыба в йогурте",
    "url": "https://cooking.nytimes.com/recipes/1026763-greek-yogurt-marinated-salmon",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "орзо-с-рыбои-https-www-instagram-com-p-dcfdujaxnij",
    "name": "Орзо с рыбой",
    "url": "https://www.instagram.com/p/DCFDujAxniJ/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "garlic-shrimp-https-www-instagram-com-reel-c2gnto8tumx",
    "name": "Garlic shrimp",
    "url": "https://www.instagram.com/reel/C2gNtO8tUMX/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "ролл-с-креветкои-https-www-instagram-com-reels-dvqy8xv",
    "name": "Ролл с креветкой",
    "url": "https://www.instagram.com/reels/DVQY8xVDEwe/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "рыба-и-оливки-https-cooking-nytimes-com-recipes-102505",
    "name": "Рыба и оливки",
    "url": "https://cooking.nytimes.com/recipes/1025052-baked-fish-with-olives-and-ginger",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "сардины-овощи-https-www-instagram-com-p-duot27tdnwh",
    "name": "Сардины + овощи",
    "url": "https://www.instagram.com/p/DUOT27tDNWH/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "белая-рыбка-удон-кешью-https-chatgpt-com-share-69ac91d",
    "name": "Белая рыбка + удон + кешью",
    "url": "https://chatgpt.com/share/69ac91da-23a0-8011-999c-93ff90a6e0db",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "белая-рыба-с-перцем-https-cooking-nytimes-com-recipes-",
    "name": "Белая рыба с перцем",
    "url": "https://cooking.nytimes.com/recipes/1017725-sheet-pan-roasted-fish-with-sweet-peppers",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "лосось-https-www-instagram-com-reels-drabqu7dmms",
    "name": "Лосось",
    "url": "https://www.instagram.com/reels/DRaBqu7DMMs/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "дорада-с-картошкои-https-www-instagram-com-reel-djwqw-",
    "name": "Дорада с картошкой",
    "url": "https://www.instagram.com/reel/DJwqw_XpdYv/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "рыбная-паста-https-www-instagram-com-p-csqwohuqisj",
    "name": "Рыбная паста",
    "url": "https://www.instagram.com/p/CsqwoHuqISj/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "креветочныи-салат-https-www-instagram-com-reel-c1bxbpb",
    "name": "Креветочный салат",
    "url": "https://www.instagram.com/reel/C1bxbPbtjaa/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "рыбныи-рулет-https-www-instagram-com-reel-dhbyjxas1iz",
    "name": "Рыбный рулет",
    "url": "https://www.instagram.com/reel/DHByjxAs1IZ/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "белая-рыба-https-www-instagram-com-reel-dkmv4s-sl0w",
    "name": "Белая рыба",
    "url": "https://www.instagram.com/reel/DKMv4S-sl0w/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "рыба-в-овощах-https-www-instagram-com-reel-de2dlr6cpil",
    "name": "Рыба в овощах",
    "url": "https://www.instagram.com/reel/DE2dlr6CpIL/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "соте-https-www-instagram-com-p-dgvnokgt6w1",
    "name": "Соте",
    "url": "https://www.instagram.com/p/DGvnOkgt6w1/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "ризотто-с-креветками-https-www-instagram-com-reel-coue",
    "name": "Ризотто с креветками",
    "url": "https://www.instagram.com/reel/Coue-CIArnf/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "креветки-с-фетои-https-cooking-nytimes-com-recipes-101",
    "name": "Креветки с фетой",
    "url": "https://cooking.nytimes.com/recipes/1015194-sheet-pan-shrimp-with-tomatoes-feta-and-oregano",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "каннеллони-с-лососем-https-www-instagram-com-p-c3i56sc",
    "name": "Каннеллони с лососем",
    "url": "https://www.instagram.com/p/C3I56sCqOgQ/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "запеченная-семга-на-овощнои-подушке-https-www-instagra",
    "name": "Запеченная семга на овощной подушке",
    "url": "https://www.instagram.com/reel/C9kLU4pirSF/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "запеченная-рыба-https-www-instagram-com-reel-c0wxeccig",
    "name": "Запеченная рыба",
    "url": "https://www.instagram.com/reel/C0wXECcigAF/",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "рыбныи-финскии-суп-https-lacuisinedegeraldine-fr-en-fi",
    "name": "Рыбный финский суп",
    "url": "https://lacuisinedegeraldine.fr/en/finnish-salmon-soup-lohikeitto",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "семга-https-www-instagram-com-reel-cn12lglk7mv",
    "name": "Семга",
    "url": "https://www.instagram.com/reel/Cn12lgLK7mv",
    "section": "Lunches & Dinners: Fish / Seafood",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "пастушии-пирог-https-cooking-nytimes-com-recipes-10264",
    "name": "Пастуший пирог",
    "url": "https://cooking.nytimes.com/recipes/1026474-cottage-pie",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "crispy-chickpeas-with-beef-https-cooking-nytimes-com-r",
    "name": "Crispy Chickpeas With Beef",
    "url": "https://cooking.nytimes.com/recipes/8024-crispy-chickpeas-with-beef",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "beef-kebab-https-cooking-nytimes-com-recipes-1026425-s",
    "name": "Beef kebab",
    "url": "https://cooking.nytimes.com/recipes/1026425-smashed-beef-kebab-with-cucumber-yogurt",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "люля-кебаб-https-www-instagram-com-p-cthcf2fqalx",
    "name": "Люля кебаб",
    "url": "https://www.instagram.com/p/CthCf2fqaLX/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "шашлычки-из-курицы-https-www-instagram-com-p-csbuy8qkz",
    "name": "Шашлычки из курицы",
    "url": "https://www.instagram.com/p/CsbUy8qKzUF/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "гуляш-в-духовке-https-www-instagram-com-reel-dibbeagss",
    "name": "Гуляш в духовке",
    "url": "https://www.instagram.com/reel/DIBbEaGsScT/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "картофель-с-фаршем-https-www-instagram-com-reel-djywlf",
    "name": "Картофель с фаршем",
    "url": "https://www.instagram.com/reel/DJyWLfmgB7w/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "запеченная-картошка-с-мясом-и-сливочными-грибами-https",
    "name": "Запеченная картошка с мясом и сливочными грибами",
    "url": "https://www.instagram.com/p/DCLo0cRt7zY/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "котлеты-с-цукини-https-www-instagram-com-reel-cyd3iorn",
    "name": "Котлеты с цукини",
    "url": "https://www.instagram.com/reel/CyD3ioRNlFL/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "бефстроганов-https-www-instagram-com-reel-cqdroobjult",
    "name": "Бефстроганов",
    "url": "https://www.instagram.com/reel/CqdRoObjuLT/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "фрикадельки-и-картошка-https-www-instagram-com-p-dbokj",
    "name": "Фрикадельки и картошка",
    "url": "https://www.instagram.com/p/DBOKjeiKv8Q/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "чашушули-https-www-instagram-com-reel-cslelipvxbk",
    "name": "Чашушули",
    "url": "https://www.instagram.com/reel/CsleliPvXbk/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "moussaka-https-www-instagram-com-p-c2ljmxqp-a7",
    "name": "Moussaka",
    "url": "https://www.instagram.com/p/C2LjMxQP-a7/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "митболы-https-www-instagram-com-p-c0cnhv6toy6",
    "name": "Митболы",
    "url": "https://www.instagram.com/p/C0CNhV6toY6/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "tomato-meatballs-and-pasta-https-www-instagram-com-ree",
    "name": "Tomato meatballs and pasta",
    "url": "https://www.instagram.com/reel/C0CNhV6toY6",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "рулет-запеканка-с-картофелем-https-www-instagram-com-r",
    "name": "Рулет-запеканка с картофелем",
    "url": "https://www.instagram.com/reel/CxcPMZooL8p/",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "чили-мед-https-t-me-masha-gotovit-274",
    "name": "Чили Мёд",
    "url": "https://t.me/masha_gotovit/274",
    "section": "Lunches & Dinners: Beef / Meat",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "тофу-рис-https-cooking-nytimes-com-recipes-1027269-i-c",
    "name": "Тофу + рис",
    "url": "https://cooking.nytimes.com/recipes/1027269-i-cant-believe-its-not-chicken-super-savory-grated-tofu",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "spanakopita-https-www-instagram-com-reels-dvsrvmjtyft",
    "name": "Spanakopita",
    "url": "https://www.instagram.com/reels/DVsrVMjTYft/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "crispy-halloumi-https-cooking-nytimes-com-recipes-1026",
    "name": "Crispy Halloumi",
    "url": "https://cooking.nytimes.com/recipes/1026520-crispy-halloumi-with-tomatoes-and-white-beans",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "ленивые-хычины-https-www-instagram-com-reel-drky8rydd9",
    "name": "Ленивые хычины",
    "url": "https://www.instagram.com/reel/DRKY8rYDd92/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "луковые-лепешки-https-www-instagram-com-p-dgd6s6fsngc",
    "name": "Луковые лепешки",
    "url": "https://www.instagram.com/p/DGD6s6FsngC/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "картофельныи-киш-https-www-instagram-com-reels-dw9ftcp",
    "name": "Картофельный киш",
    "url": "https://www.instagram.com/reels/DW9FtCpCMF1/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "onigiri-rice-sandwich-https-www-instagram-com-reels-du",
    "name": "Onigiri Rice Sandwich",
    "url": "https://www.instagram.com/reels/DU2H_2WEZmA/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "rice-paper-sausage-https-www-instagram-com-p-dwbp79nd9",
    "name": "Rice Paper sausage",
    "url": "https://www.instagram.com/p/DWbp79ND9wk/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "шпинатные-блины-https-www-instagram-com-reel-dkpi5vpil",
    "name": "Шпинатные блины",
    "url": "https://www.instagram.com/reel/DKpI5vpilzc/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "легкие-wraps-https-www-instagram-com-reel-dqrorzzjugd",
    "name": "Легкие wraps",
    "url": "https://www.instagram.com/reel/DQrorZzjUgd/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "crispy-rice-salad-https-www-instagram-com-p-c-yxttos2k",
    "name": "Crispy rice salad",
    "url": "https://www.instagram.com/p/C-YxtToS2K7/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "halloumi-wrap-https-www-instagram-com-p-dtvx2yjca0u",
    "name": "Halloumi wrap",
    "url": "https://www.instagram.com/p/DTvX2YjCA0u/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "кукурузные-лепешки-https-www-instagram-com-reel-dmplvx",
    "name": "Кукурузные лепешки",
    "url": "https://www.instagram.com/reel/DMplVXqMxQH/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "творожные-котлеты-https-www-instagram-com-p-dmxghdbusn",
    "name": "Творожные котлеты",
    "url": "https://www.instagram.com/p/DMXghDbuSn7/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "кимчи-гриль-чиз-https-www-instagram-com-reel-dcoa1x5ms",
    "name": "Кимчи гриль-чиз",
    "url": "https://www.instagram.com/reel/DCoA1x5MSNA/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "тушеные-кабачки-и-баклажаны-с-нутом-https-www-instagra",
    "name": "Тушеные кабачки и баклажаны с нутом",
    "url": "https://www.instagram.com/reel/C9SYYBWCrO7/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "картофельные-блины-https-www-instagram-com-p-c4fdk-eqx",
    "name": "Картофельные блины",
    "url": "https://www.instagram.com/p/C4fDk_EqxIr/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "пирог-с-травои-https-www-youtube-com-watch-v-qfmq2me2b",
    "name": "Пирог с травой",
    "url": "https://www.youtube.com/watch?v=QfmQ2me2b0M&si=31HZx7RG633qMQ_W",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "хычины-https-www-instagram-com-reel-c0mobb0izwe",
    "name": "Хычины",
    "url": "https://www.instagram.com/reel/C0MObB0IZWE/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "тосканскии-пирог-https-www-instagram-com-p-cvhjexuu3mw",
    "name": "Тосканский пирог",
    "url": "https://www.instagram.com/p/CvHjexuu3MW/",
    "section": "Lunches & Dinners: Vegetarian / Tofu / Cheese",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "тунцовая-паста-https-www-instagram-com-p-duxvytlic7d",
    "name": "Тунцовая паста",
    "url": "https://www.instagram.com/p/DUXVYtlic7d/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "caramelized-onion-and-garlic-spaghetti-https-www-insta",
    "name": "Caramelized Onion and Garlic Spaghetti",
    "url": "https://www.instagram.com/p/C5mxaeftMKf/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "мак-энд-чиз-https-t-me-joinmashastories-2151",
    "name": "Мак энд Чиз",
    "url": "https://t.me/joinmashastories/2151",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "peanut-noodles-https-www-instagram-com-reel-duwnxewers",
    "name": "Peanut noodles",
    "url": "https://www.instagram.com/reel/DUWnXeWErSX/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "fried-pasta-salad-https-www-instagram-com-reels-dwl9jp",
    "name": "Fried Pasta Salad",
    "url": "https://www.instagram.com/reels/DWl9JpJjcct/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "pasta-con-ricotta-https-www-instagram-com-p-de3k-rurvz",
    "name": "Pasta con Ricotta",
    "url": "https://www.instagram.com/p/DE3K_ruRvz_/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "рисовыи-боул-https-www-instagram-com-reel-djjije9svce",
    "name": "Рисовый боул",
    "url": "https://www.instagram.com/reel/DJjijE9svce/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "orecchiette-https-www-instagram-com-p-dm9-anso-r",
    "name": "Orecchiette",
    "url": "https://www.instagram.com/p/DM9_anSo--R/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "easy-noodles-https-www-instagram-com-reel-c1e-x9wpl8k",
    "name": "Easy noodles",
    "url": "https://www.instagram.com/reel/C1e_x9wpL8K/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "паста-капоната-https-www-instagram-com-reel-dlksetto8j",
    "name": "Паста капоната",
    "url": "https://www.instagram.com/reel/DLksEtto8JG/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "паста-со-спагетти-https-www-instagram-com-reel-dlfziy0",
    "name": "Паста со спагетти",
    "url": "https://www.instagram.com/reel/DLFZIY0olF9/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "ленивая-лазанья-https-www-instagram-com-reel-dkhuphtxe",
    "name": "Ленивая лазанья",
    "url": "https://www.instagram.com/reel/DKhuphtxEH4/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "stuffed-shells-https-www-tiktok-com-al-dante-channel-v",
    "name": "Stuffed Shells",
    "url": "https://www.tiktok.com/@al_dante_channel/video/7229331291030703406",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "равиоли-https-www-instagram-com-p-c2fzlbkifhw",
    "name": "Равиоли",
    "url": "https://www.instagram.com/p/C2FZLbkiFHW/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "lasagna-soup-https-www-instagram-com-reel-c1afmcoo4q4",
    "name": "Lasagna Soup",
    "url": "https://www.instagram.com/reel/C1aFmcOO4q4/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "паста-орзо-https-www-instagram-com-reel-czl9hshncuo",
    "name": "Паста орзо",
    "url": "https://www.instagram.com/reel/CzL9hSHNcuO/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "onion-pasta-https-bakecookrepeat-com-recipe-one-pot-fr",
    "name": "Onion Pasta",
    "url": "https://bakecookrepeat.com/recipe/one-pot-french-onion-pasta/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "pasta-salad-with-pesto-https-simplehomeedit-com-recipe",
    "name": "Pasta salad with pesto",
    "url": "https://simplehomeedit.com/recipe/pesto-pasta-salad/",
    "section": "Pasta / Noodles / Rice / Bowls",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "tomato-soup-https-cooking-nytimes-com-recipes-1022653-",
    "name": "Tomato soup",
    "url": "https://cooking.nytimes.com/recipes/1022653-quick-tomato-soup-with-grilled-cheese",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "картофельныи-суп-https-butterhand-com-loaded-potato-so",
    "name": "Картофельный суп",
    "url": "https://butterhand.com/loaded-potato-soup/",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "луковыи-суп-https-t-me-ariilsmeals-751",
    "name": "Луковый суп",
    "url": "https://t.me/ariilsmeals/751",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "вирмешель-курица-суп-https-cooking-nytimes-com-recipes",
    "name": "Вирмешель + курица суп",
    "url": "https://cooking.nytimes.com/recipes/1026337-chicken-and-vermicelli-soup-with-lime",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "картофельныи-суп-с-луком-https-butterhand-com-potato-l",
    "name": "Картофельный суп с луком",
    "url": "https://butterhand.com/potato-leek-soup/",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "томатныи-крем-суп-https-www-instagram-com-reel-c4npy2v",
    "name": "Томатный крем суп",
    "url": "https://www.instagram.com/reel/C4npY2ViNlm/",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "тыквенныи-суп-https-www-instagram-com-p-c-c9kyvnjq0",
    "name": "Тыквенный суп",
    "url": "https://www.instagram.com/p/C_C9kYvNjQ0/",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "гороховыи-суп-https-www-instagram-com-reel-czoosyaqnnu",
    "name": "Гороховый суп",
    "url": "https://www.instagram.com/reel/CzoosyaqnNU/",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "рассольник-https-www-russianfood-com-recipes-recipe-ph",
    "name": "Рассольник",
    "url": "https://www.russianfood.com/recipes/recipe.php?rid=125760",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "матбуха-https-www-instagram-com-reel-c1h1pefrhxi",
    "name": "Матбуха",
    "url": "https://www.instagram.com/reel/C1H1PefRHXi/",
    "section": "Soups",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "fish-salad-https-www-instagram-com-reels-dvvwwiojfv3",
    "name": "Fish salad",
    "url": "https://www.instagram.com/reels/DVvwWiOjFV3/",
    "section": "Salads",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "салат-курица-капуста-https-www-instagram-com-reel-dugb",
    "name": "Салат курица + капуста",
    "url": "https://www.instagram.com/reel/DUGbO84jfE9/",
    "section": "Salads",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "салат-с-курицеи-и-фасолью-https-www-instagram-com-reel",
    "name": "Салат с курицей и фасолью",
    "url": "https://www.instagram.com/reel/DSASZG6jdxQ/",
    "section": "Salads",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "салат-с-картофелем-https-www-instagram-com-reel-c9hqur",
    "name": "Салат с картофелем",
    "url": "https://www.instagram.com/reel/C9hQURoAxrd/",
    "section": "Salads",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "салат-с-перцами-https-www-instagram-com-reel-di3ab88sx",
    "name": "Салат с перцами",
    "url": "https://www.instagram.com/reel/DI3Ab88sx6T/",
    "section": "Salads",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "smashed-potato-salad-https-www-drveganblog-com-smashed",
    "name": "Smashed potato salad",
    "url": "https://www.drveganblog.com/smashed-potato-salad/",
    "section": "Salads",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "беиглы-https-www-instagram-com-p-c1bzllubt-b",
    "name": "Бейглы",
    "url": "https://www.instagram.com/p/C1bzLluBt_b/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "цезарь-сендвич-https-www-instagram-com-p-cn5aga3dsua",
    "name": "Цезарь сендвич",
    "url": "https://www.instagram.com/p/CN5AgA3DsUa/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "bagel-sandwich-https-www-instagram-com-p-dv2s2hukxi2",
    "name": "Bagel Sandwich",
    "url": "https://www.instagram.com/p/DV2S2hukXi2/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "ham-cheese-roll-https-www-instagram-com-reels-dvlwg-qj",
    "name": "Ham & Cheese roll",
    "url": "https://www.instagram.com/reels/DVlwG_QjMQu/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "шаверма-https-www-instagram-com-reel-df5axflozpc",
    "name": "Шаверма",
    "url": "https://www.instagram.com/reel/DF5axFlOzPc/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "doner-https-www-instagram-com-p-dr6brifcmqv",
    "name": "Doner",
    "url": "https://www.instagram.com/p/DR6bRifCMqv/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "бутерброд-с-иогуртом-https-www-facebook-com-reel-19709",
    "name": "Бутерброд с йогуртом",
    "url": "https://www.facebook.com/reel/197094963362878",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "буратта-сендвич-https-www-instagram-com-reel-cv4wqvvng",
    "name": "Буратта сендвич",
    "url": "https://www.instagram.com/reel/Cv4WQVVNgPv/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "сэндвич-с-фетои-https-www-instagram-com-reel-dfz3eadss",
    "name": "Сэндвич с фетой",
    "url": "https://www.instagram.com/reel/DFZ3EADss7p/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "бутерброд-с-креветками-и-халуми-https-www-instagram-co",
    "name": "Бутерброд с креветками и халуми",
    "url": "https://www.instagram.com/reel/DGJigfOtrGI/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "tune-melt-wrap-https-www-instagram-com-reel-cxn-wgaimy",
    "name": "Tune melt wrap",
    "url": "https://www.instagram.com/reel/Cxn_WGaIMys/",
    "section": "Sandwiches / Wraps / Snacks",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "картошка-в-микроволновке-https-www-instagram-com-reels",
    "name": "Картошка в микроволновке",
    "url": "https://www.instagram.com/reels/DSFOZ1KjHC7/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "вареная-картошка-мишлен-https-www-instagram-com-reels-",
    "name": "Вареная картошка Мишлен",
    "url": "https://www.instagram.com/reels/DRcfQGNAgVG/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "tomato-appetizer-https-www-instagram-com-p-dlxjo8eorkh",
    "name": "Tomato Appetizer",
    "url": "https://www.instagram.com/p/DLxJo8EoRkH/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "закуска-из-баклажанов-https-www-facebook-com-reel-1413",
    "name": "Закуска из баклажанов",
    "url": "https://www.facebook.com/reel/1413109966211097",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "вяленные-томаты-https-www-instagram-com-reel-cwslvfpox",
    "name": "Вяленные томаты",
    "url": "https://www.instagram.com/reel/CwSLVfPoXcI/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "соус-из-перцев-https-www-instagram-com-reel-cw2kg1xsj3",
    "name": "Соус из перцев",
    "url": "https://www.instagram.com/reel/Cw2kg1xsj3u/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": false
  },
  {
    "id": "marinated-eggs-https-www-instagram-com-reel-cuulq5eo9p",
    "name": "Marinated Eggs",
    "url": "https://www.instagram.com/reel/CuUlQ5EO9P_/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "паштет-https-www-instagram-com-reel-drhl-lkioyh",
    "name": "Паштет",
    "url": "https://www.instagram.com/reel/DRhl_lkiOYh/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "паштет-https-www-instagram-com-p-dgqgca7midu",
    "name": "Паштет",
    "url": "https://www.instagram.com/p/DGqGcA7MiDU/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "easy-dumplings-https-www-instagram-com-reel-c1xwsuestk",
    "name": "Easy dumplings",
    "url": "https://www.instagram.com/reel/C1XwsueStK_/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "flower-egg-https-www-instagram-com-reel-czwgcqlv7vw",
    "name": "Flower Egg",
    "url": "https://www.instagram.com/reel/CzwgCQLv7VW/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "garlic-roast-potato-https-app-samsungfood-com-recipes-",
    "name": "Garlic roast potato",
    "url": "https://app.samsungfood.com/recipes/107018ba0089d3273ae8458e5ae0cb1d4e3",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "кабачковая-икра-https-www-instagram-com-reel-cythvb",
    "name": "Кабачковая икра",
    "url": "https://www.instagram.com/reel/CyThvb",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "песто-https-t-me-ariilsmeals-725",
    "name": "Песто",
    "url": "https://t.me/ariilsmeals/725",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "spam-https-www-instagram-com-reel-c-cdyshxfem",
    "name": "SPAM",
    "url": "https://www.instagram.com/reel/C-CDYshxfeM/",
    "section": "Sides / Appetizers / Sauces",
    "defaultMealType": "lunch",
    "cooked": true
  },
  {
    "id": "муравеиник-https-www-instagram-com-p-dhbsts5iqli",
    "name": "Муравейник",
    "url": "https://www.instagram.com/p/DHBSTs5IQLi/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "булочки-с-миндальным-кремом-https-www-instagram-com-da",
    "name": "Булочки с миндальным кремом",
    "url": "https://www.instagram.com/daniya_alt/reel/DGF-wPSCh6F/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "lemon-posset-brulee-https-www-instagram-com-reel-cugzm",
    "name": "Lemon Posset Brûlée",
    "url": "https://www.instagram.com/reel/CugZmyvsSwo/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "пирог-с-инжиром-https-www-instagram-com-reel-cwo0wypti",
    "name": "Пирог с инжиром",
    "url": "https://www.instagram.com/reel/Cwo0wYptIJc/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": false
  },
  {
    "id": "berry-crumble-https-butterhand-com-mixed-berry-crumble",
    "name": "Berry crumble",
    "url": "https://butterhand.com/mixed-berry-crumble/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "банановое-печенье-https-www-instagram-com-reel-c8helsu",
    "name": "Банановое печенье",
    "url": "https://www.instagram.com/reel/C8hElsuCnIH/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": true
  },
  {
    "id": "творожная-галета-https-www-instagram-com-p-dlfothpo5co",
    "name": "Творожная галета",
    "url": "https://www.instagram.com/p/DLFotHPo5co/",
    "section": "Desserts & Baking",
    "defaultMealType": "dinner",
    "cooked": true
  }
];
