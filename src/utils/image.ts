/**
 * 根据国家名称与着装说明生成 AI 人物着装插画 URL。
 * 使用 TRAE 内置图片生成服务。
 */
export function generateAttireImageUrl(countryName: string, caption: string): string {
  const prompt = `A full-body historical soldier figure from ${countryName} wearing ${caption}, neutral background, realistic historical illustration style, detailed uniform, museum-quality lighting, no text, no watermark`;
  const encoded = encodeURIComponent(prompt);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=portrait_4_3`;
}

/**
 * 中文战争名到英文的映射，用于 AI 图片生成。
 * AI 图片 API 对英文 prompt 支持更好。
 */
const WAR_NAME_EN: Record<string, string> = {
  '伯罗奔尼撒战争': 'Peloponnesian War',
  '布匿战争': 'Punic Wars',
  '秦统一战争': 'Qin unification wars',
  '三国战争': 'Three Kingdoms wars',
  '安史之乱': 'An Lushan Rebellion',
  '十字军东征': 'Crusades',
  '蒙古西征': 'Mongol conquests',
  '百年战争': 'Hundred Years War',
  '三十年战争': 'Thirty Years War',
  '七年战争': 'Seven Years War',
  '美国独立战争': 'American Revolutionary War',
  '拿破仑战争': 'Napoleonic Wars',
  '鸦片战争': 'Opium War',
  '太平天国运动': 'Taiping Rebellion',
  '克里米亚战争': 'Crimean War',
  '美国内战': 'American Civil War',
  '普法战争': 'Franco-Prussian War',
  '甲午战争': 'First Sino-Japanese War',
  '日俄战争': 'Russo-Japanese War',
  '第一次世界大战': 'World War I',
  '俄国革命': 'Russian Revolution',
  '西班牙内战': 'Spanish Civil War',
  '第二次世界大战': 'World War II',
  '中国内战': 'Chinese Civil War',
  '朝鲜战争': 'Korean War',
  '越南抗法战争': 'First Indochina War',
  '古巴导弹危机': 'Cuban Missile Crisis',
  '越南战争': 'Vietnam War',
  '六日战争': 'Six-Day War',
  '中印边境战争': 'Sino-Indian War',
  '印巴战争': 'Indo-Pakistani War',
  '中东战争': 'Arab-Israeli wars',
  '阿富汗战争（苏联）': 'Soviet-Afghan War',
  '两伊战争': 'Iran-Iraq War',
  '马岛战争': 'Falklands War',
  '海湾战争': 'Gulf War',
  '卢旺达种族灭绝': 'Rwandan genocide conflict',
  '科索沃战争': 'Kosovo War',
  '9·11恐怖袭击': 'September 11 attacks',
  '阿富汗战争': 'War in Afghanistan',
  '伊拉克战争': 'Iraq War',
  '叙利亚内战': 'Syrian civil war',
  '美伊冲突': 'Iran-US conflict',
  '俄乌冲突': 'Russo-Ukrainian War',
  '也门内战': 'Yemeni civil war',
  '罗马帝国灭亡': 'fall of Western Roman Empire',
  '君士坦丁堡陷落': 'fall of Constantinople',
  '中越边境战争': 'Sino-Vietnamese War',
};

/**
 * 根据战争名称、地点和背景生成 AI 战争场景插画 URL。
 * 使用 TRAE 内置图片生成服务。
 */
export function generateWarImageUrl(
  warName: string,
  location: string,
  year: number,
  belligerents: string[],
  background: string
): string {
  const enName = WAR_NAME_EN[warName] ?? warName;
  const factions = belligerents.slice(0, 3).join(' vs ');
  const prompt = `A dramatic historical war scene of ${enName} (${year}) in ${location}, ${factions}, ${background.slice(0, 120)}, epic battlefield illustration, atmospheric smoke and dramatic lighting, historical painting style, no text, no watermark`;
  const encoded = encodeURIComponent(prompt);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=landscape_4_3`;
}
