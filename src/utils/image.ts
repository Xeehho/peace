/**
 * 根据国家名称与着装说明生成 AI 人物着装插画 URL。
 * 使用 TRAE 内置图片生成服务。
 */
export function generateAttireImageUrl(countryName: string, caption: string): string {
  const prompt = `A full-body historical soldier figure from ${countryName} wearing ${caption}, neutral background, realistic historical illustration style, detailed uniform, museum-quality lighting, no text, no watermark`;
  const encoded = encodeURIComponent(prompt);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=portrait_4_3`;
}
