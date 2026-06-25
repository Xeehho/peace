/**
 * 公共领域（Public Domain）铜版画 / 木刻风格插画素材清单。
 * 来源：Wikimedia Commons（upload.wikimedia.org 直接文件路径）。
 * 全部为 PD-old / PD-Art 授权，可直接 <img src> 加载。
 *
 * 设计：每个 variant 拥有独立图池，且池容量 ≥ 该 variant 在项目中的总实例数 × 单实例张数。
 * PageBackground 通过 instance 索引从对应 variant 池中取互不重叠的切片，确保全项目无重复图片。
 */

// 战争场景：士兵、战役、行军、骑兵、火炮、海战（共 15 张）
const WAR_POOL: string[] = [
  // 实例 1（首页 WarHighlights）
  'https://upload.wikimedia.org/wikipedia/commons/8/8c/Veldslag_met_ruiters%2C_twee_kanonnen_op_de_voorgrond%2C_RP-P-OB-13.088.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/90/Cavaleriegevecht%2C_RP-P-OB-66.107.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/37/Battle_of_Blanchetaque_in_1346_%28crossing_the_Somme%2C_engraving%29.png',
  // 实例 2（Insights TOP10）
  'https://upload.wikimedia.org/wikipedia/commons/d/d4/Battle_of_Alesia_in_52_BC_%28engraving%29.png',
  'https://upload.wikimedia.org/wikipedia/commons/8/8c/Combat_of_Rouvray_or_the_Battle_of_the_Herrings_in_1429_%28engraving%29.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/40/Battle_of_Mantes-la-Jolie_in_1188_%28engraving%29.png',
  // 备用扩展（warArchive 仅需 6 张，但保留余量以便复用）
  'https://upload.wikimedia.org/wikipedia/commons/1/1b/Battle_of_Polog_1453.png',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/Battle_of_Temesv%C3%A1r_V._Katzler.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/81/Cavalry_Battle_MET_DP841888.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4e/Battle_of_Fontenoy2.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/18/Union_cavalry_charge_at_Honey_Springs%2C_1863.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/Battle_of_Vauchamps_by_Reville.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bohemund_of_taranto_in_the_battle.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/Caton-Woodville_Battle_of_Minden_1759.jpeg',
  'https://upload.wikimedia.org/wikipedia/commons/1/1c/Zeeslag_bij_Terheide%2C_1653_Laeste_zeeslach_van_M.H._Tromp_L._Admirael_van_Hollandt_etc._Tegen_die_van_Engelant_1653_%28titel_op_object%29%2C_RP-P-OB-81.809.jpg',
];

// 和平象征：和平女神、握手、橄榄枝、寓言（共 9 张）
const PEACE_POOL: string[] = [
  // quotes 实例（深色背景，2 张）
  'https://upload.wikimedia.org/wikipedia/commons/6/61/An_allegory_of_Peace%3B_Peace_personified_as_a_woman_standing_in_a_landscape_holding_the_left_hand_of_a_winged_genius_MET_DP854374.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/bf/An_allegory_of_Peace%3B_Peace_personified_as_a_woman_standing_in_a_landscape_holding_the_left_hand_of_a_winged_genius_MET_DP838154.jpg',
  // cta 实例 1（首页）
  'https://upload.wikimedia.org/wikipedia/commons/7/72/Domenico_Tibaldi%2C_Allegory_of_Peace%2C_c._1560%2C_NGA_212451.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7f/Allegorical_Figure_of_Peace_LACMA_M.88.91.180.jpg',
  // cta 实例 2（Insights 反思语）
  'https://upload.wikimedia.org/wikipedia/commons/a/a2/Allegorie_op_de_vrede%2C_RP-P-1921-846.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8b/Triomfwagen_met_Vrede_%28Pax%29_Circulus_Vicissitudinis_Rerum_Humanarum_%28serietitel%29%2C_RP-P-1963-175.jpg',
  // cta 实例 3（About 致谢）
  'https://upload.wikimedia.org/wikipedia/commons/9/9f/Vrede_De_lotgevallen_van_het_leven_%28serietitel%29%2C_RP-P-1891-A-16227.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/Allegorie_op_de_Vrede_van_Amiens%2C_1802_Peace_%28titel_op_object%29%2C_RP-P-OB-86.827.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/8f/Pax_mit_der_thronenden_Maria_mit_Kind_und_Engeln.jpg',
];

// 历史档案 / 古地图 / 古籍 / 修道院（共 14 张）
const ARCHIVE_POOL: string[] = [
  // hero 实例 1（Insights 标题区，2 张）
  'https://upload.wikimedia.org/wikipedia/commons/3/3b/World_Map_1689.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/0/06/Frederick_de_Wit._Maps_of_Asia._copper_engraving._1670s.gif',
  // hero 实例 2（About 英雄区，2 张）
  'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bertius_map_of_Tartaria.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d4/Milkau_B%C3%BCcherschrank_mit_angekettetem_Buch_aus_der_Bibliothek_von_Cesena_109-2.jpg',
  // about 实例 1（About 使命，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/9/93/Page_from_the_edition_of_Divine_Commedy_printed_by_Nicolaus_Laurentii_in_1481.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/0e/Richelieu_engraving_17th_century.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b8/France_Chartres_17th-c-engraving.jpg',
  // about 实例 2（About 为什么，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/4/42/Sitting_Leo_Belgicus_-_Visscher.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/94/Torino%27s_map_%281674%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4e/A_Constantinople_engraving_by_Jaspar_Isaac.jpg',
  // about 实例 3（About 数据来源，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/0/0f/Stadt_Bremen_17th_Century_1640.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/49/Manuscript_Rosengaert_enz_van_St-Andriesklooster%2C_Maastricht%2C_16e_eeuw_%28KB_134_C_53%29_-3.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/24/Paulus_St_Gallen.jpg',
  // 备用
  'https://upload.wikimedia.org/wikipedia/commons/0/0e/Graduale_van_Dominicanenklooster_Maastricht%2C_1530_%28KB_71_A_3%29.jpg',
];

// 数据 / 图表 / 天文 / 哲学 / 解剖（共 15 张）
const DATA_POOL: string[] = [
  // stats 实例 1（首页 StatsSection，1 张）
  'https://upload.wikimedia.org/wikipedia/commons/9/95/1660_celestial_map_of_constellations_according_to_Christian_symbolism.jpg',
  // stats 实例 2（Insights 核心统计，1 张）
  'https://upload.wikimedia.org/wikipedia/commons/9/96/1660_engraving_Scenographia_Systematis_Copernicani.jpg',
  // insights 实例 1（Insights 时代趋势，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/2/2c/Carte_Theoria_Lun%C3%A6%2C_eius_motum_per_eccentricum_et_epicyclum_demonstrans.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/49/A_human_skeleton%2C_leaning_against_a_tomb%2C_after_Vesalius%3B_la_Wellcome_V0007853EL.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/58/Vesalius%2C_De_humani_corporis..._Wellcome_L0011135.jpg',
  // insights 实例 2（Insights 国家参与，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/c/c3/A_human_skeleton%2C_seen_from_the_front%2C_resting_the_bones_of_Wellcome_V0007798.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a2/Gore_10%2C_Celestial_Globe_%28IA_dr_gore-10-celestial-globe-10714016%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/89/Cellarius_Harmonia_Macrocosmica_-_Corporum_Coelestium_Magnitudines.jpg',
  // insights 实例 3（About 方法论，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/a/a6/Cellarius_Harmonia_Macrocosmica_-_Hypothesis_Ptolemaica.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/bc/Cellarius_Harmonia_Macrocosmica_-_Planisphaerium_Braheum.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cellarius_Harmonia_Macrocosmica_-_Scenographia_Compagis_Mundanae_Brahea.jpg',
  // insights 实例 4（About 技术实现，3 张）
  'https://upload.wikimedia.org/wikipedia/commons/e/ea/Cellarius_Harmonia_Macrocosmica_-_Planisphaerium_Ptolemaicum.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/69/De_humani_corporis_fabrica_%2827%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/75/1748_Bowen_Mariner%E2%80%99s_Compass_and_Armillary_Sphere_-_Geographicus_-_CircleofWinds-bowen-1747.jpg',
  // 备用
  'https://upload.wikimedia.org/wikipedia/commons/d/d5/Euclide%2C_Elementa_geometriae%2C_1482.jpg',
];

/**
 * 按 variant 与实例索引返回互不重复的图片切片。
 *
 * @param variant  背景 variant
 * @param instance 同一 variant 在项目中的第几个实例（0-based）
 * @param count    该实例需要几张图
 * @returns        图片 URL 数组（若池容量不足，返回池末尾剩余）
 */
export function getEngravings(
  variant: 'war' | 'peace' | 'archive' | 'data',
  instance: number,
  count: number
): string[] {
  const pool =
    variant === 'war'
      ? WAR_POOL
      : variant === 'peace'
        ? PEACE_POOL
        : variant === 'archive'
          ? ARCHIVE_POOL
          : DATA_POOL;
  const start = instance * count;
  if (start >= pool.length) return [];
  return pool.slice(start, start + count);
}
