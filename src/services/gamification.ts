export interface SisterMemory {
  title: string;
  partnerAvatar: string;
  quoteDe: string;
  quoteMn: string;
  tag: string;
}

export interface IstpRankInfo {
  tierName: string;
  tierBadge: string;
  stars: number;
  nextTier: string;
  progressPercent: number;
  combatRole: string;
}

export interface IsfjHeroRankInfo {
  rankTitle: string;
  rankBadge: string;
  breathingStyle: string;
  buddyBondPercent: number;
  heroQuote: string;
  shieldStatus: string;
  universe: 'Demon Slayer' | 'My Hero Academia' | 'Anime Hero';
}

// 1. INFJ (Мөнгөнчимэг) - K-Drama Aesthetic Daily Memories
export function getSisterMemory(
  day: number,
  partnerName: string,
  _userName: string
): SisterMemory {
  const memories: Record<number, { quoteDe: string; quoteMn: string; tag: string }> = {
    1: {
      quoteDe: 'Schön, dich kennenzulernen!',
      quoteMn: `Өнөөдөр ${partnerName}-тэй анх удаа германаар мэндчилж, нэрээ хэлж танилцлаа. Дөлгөөхөн, намуун өдрийн сайхан эхлэл!`,
      tag: '🌸 Анхны танилцал',
    },
    2: {
      quoteDe: 'Wie geht es dir? - Sehr gut, danke!',
      quoteMn: `${partnerName}-тэй өдрийн сонин сайхнаа хуваалцаж, бие биенийхээ сэтгэл санааг асуулаа. Дотно дулаан яриа!`,
      tag: '✨ Сэтгэлийн дотно яриа',
    },
    3: {
      quoteDe: 'Ich bin 14 Jahre alt.',
      quoteMn: `Хэдэн настайгаа хуваалцаж, бие биенээ улам сайн ойлгож эхэллээ. Найзынхаа тухай шинэ зүйл мэдсэн өдөр.`,
      tag: '🌷 Насны сонин',
    },
    4: {
      quoteDe: 'Ich habe eine tolle Familie.',
      quoteMn: `Гэр бүлийнхээ тухай германаар ярилцаж, дотно дулаан мэдрэмж төрлөө. Гэр бүл бол хамгийн нандин эрдэнэ.`,
      tag: '🍃 Хайрт гэр бүл',
    },
    5: {
      quoteDe: 'Ich wohne hier sehr gern.',
      quoteMn: `Хаана амьдардаг, ямар хотод байдгаа ярилцаж, өөрсдийн дуртай газруудын тухай хөөрөлдлөө.`,
      tag: '☁️ Хотын түүхүүд',
    },
    6: {
      quoteDe: 'Musik hören macht Spaß!',
      quoteMn: `Дуртай хөгжим, хобби, чөлөөт цагаа хэрхэн өнгөрөөдөг тухайгаа ярьсан үнэхээр сэтгэл сэргээсэн өдөр!`,
      tag: '🎀 Дуртай хобби',
    },
    7: {
      quoteDe: 'Was isst du gern?',
      quoteMn: `Дуртай амттан, хоол ундаагаа германаар нэрлэж, маш амттай хөгжилтэй яриа өрнүүллээ.`,
      tag: '🍰 Амтат яриа',
    },
    8: {
      quoteDe: 'Das Wetter ist heute so schön.',
      quoteMn: `Цаг агаар, өнөөдрийн нартай тэнгэрийн тухай германаар ярилцаж, сэтгэл цэлмэсэн өдөр боллоо.`,
      tag: '☀️ Нартай өдөр',
    },
    9: {
      quoteDe: 'Ich lerne jeden Tag etwas Neues.',
      quoteMn: `Сургууль, дуртай хичээл, ирээдүйн хүсэл мөрөөдлийнхөө тухай чин сэтгэлээсээ ярилцлаа.`,
      tag: '🌟 Мөрөөдлийн жигүүр',
    },
    10: {
      quoteDe: 'Wir sind ein tolles Team!',
      quoteMn: `Анхны 10 өдрийн аялал амжилттай дууслаа! ${partnerName} бид хоёр үнэхээр сайн найзууд боллоо!`,
      tag: '💖 Бат нөхөрлөл',
    },
  };

  const mem = memories[day] || {
    quoteDe: 'Toll gemacht!',
    quoteMn: `${partnerName}-тэй хамт өнөөдрийн хичээлээ амжилттай давтаж, шинэ дурсамж бүтээлээ!`,
    tag: '🌸 Өдрийн дурсамж',
  };

  return {
    title: `${day}-р өдрийн нандин дурсамж`,
    partnerAvatar: '🌸',
    quoteDe: mem.quoteDe,
    quoteMn: mem.quoteMn,
    tag: mem.tag,
  };
}

// 2. ISTP (Томоо) - Mobile Legends Cyber HUD Ranks
export function getIstpRank(completedDaysCount: number, _xp: number): IstpRankInfo {
  if (completedDaysCount >= 10) {
    return {
      tierName: 'Legend (Домог)',
      tierBadge: '⚡',
      stars: 5,
      nextTier: 'Mythic (Тэнгэрлэг баатар)',
      progressPercent: 100,
      combatRole: 'Домогт удирдагч',
    };
  }
  if (completedDaysCount >= 8) {
    return {
      tierName: 'Epic (Эпик тулаанч)',
      tierBadge: '🔱',
      stars: 4,
      nextTier: 'Legend',
      progressPercent: 80,
      combatRole: 'Грамматик ангууч',
    };
  }
  if (completedDaysCount >= 6) {
    return {
      tierName: 'Grandmaster (Их мастер)',
      tierBadge: '👑',
      stars: 3,
      nextTier: 'Epic',
      progressPercent: 60,
      combatRole: 'Тактикийн мастер',
    };
  }
  if (completedDaysCount >= 4) {
    return {
      tierName: 'Master (Мастер II)',
      tierBadge: '🎖️',
      stars: 3,
      nextTier: 'Grandmaster',
      progressPercent: 40,
      combatRole: 'Шуурхай довтлогч',
    };
  }
  if (completedDaysCount >= 2) {
    return {
      tierName: 'Elite (Элит III)',
      tierBadge: '⚔️',
      stars: 2,
      nextTier: 'Master',
      progressPercent: 20,
      combatRole: 'Хурдан суралцагч',
    };
  }
  return {
    tierName: 'Warrior (Дайчин I)',
    tierBadge: '🛡️',
    stars: 1,
    nextTier: 'Elite',
    progressPercent: 10,
    combatRole: 'Шинэ цэрэг',
  };
}

// 3. ISFJ (Жижгээ) - Demon Slayer & My Hero Academia Hero Rank & Buddy Bond
export function getIsfjHeroRank(
  completedDaysCount: number,
  partnerName: string
): IsfjHeroRankInfo {
  const nameLower = (partnerName || '').toLowerCase();
  const isMHA =
    nameLower.includes('deku') ||
    nameLower.includes('all might') ||
    nameLower.includes('todoroki') ||
    nameLower.includes('bakugo') ||
    nameLower.includes('ochaco') ||
    nameLower.includes('kirishima');

  const universe: 'Demon Slayer' | 'My Hero Academia' | 'Anime Hero' = isMHA
    ? 'My Hero Academia'
    : 'Demon Slayer';

  const buddyBondPercent = Math.min(100, Math.max(10, (completedDaysCount || 1) * 10));

  if (completedDaysCount >= 10) {
    return {
      rankTitle: isMHA ? 'Pro-Hero • Symbol of Peace' : 'Hashira (Багана) • Тэргүүн зэрэг',
      rankBadge: '⭐',
      breathingStyle: isMHA ? 'One For All 100% (Plus Ultra!)' : 'Нарны амьсгал (Hinokami Kagura)',
      buddyBondPercent: 100,
      heroQuote: isMHA
        ? 'Plus Ultra! Маргаашийн бэлтгэл хүртэл амраарай!'
        : 'Бүх анхаарлын амьсгал! Бид хамтдаа эцсээ хүртэл тэмцэнэ!',
      shieldStatus: 'Бамбай идэвхтэй: Дээд зэргийн хамгаалалттай!',
      universe,
    };
  }
  if (completedDaysCount >= 7) {
    return {
      rankTitle: isMHA ? 'U.A. Элит Баатар (Pro License)' : 'Kinoe (Дээд дайчин)',
      rankBadge: '🔥',
      breathingStyle: isMHA ? 'One For All 45% + Blackwhip' : 'Галын амьсгал / Ничирин сэлэм',
      buddyBondPercent,
      heroQuote: isMHA
        ? 'Би хэзээ ч бууж өгөхгүй! Багийнхантайгаа үргэлж хамт!'
        : 'Зүрх сэтгэлээ бадраа! Алхам алхмаар урагшил!',
      shieldStatus: 'Бамбай идэвхтэй: Цуврал бүрэн хамгаалагдсан',
      universe,
    };
  }
  if (completedDaysCount >= 5) {
    return {
      rankTitle: isMHA ? 'U.A. 1-A Багийн Аврагч' : 'Tsuchinoto (Бат хамгаалагч)',
      rankBadge: '🛡️',
      breathingStyle: isMHA ? 'Full Cowl 20% Shoot Style' : 'Усны амьсгал • 10-р хэлбэр',
      buddyBondPercent,
      heroQuote: isMHA
        ? 'Нөхдөө аврах нь миний хамгийн том үүрэг!'
        : 'Ус шиг уян хатан, тууштай байх ёстой!',
      shieldStatus: 'Бамбай идэвхтэй: Цуврал хамгаалагдсан',
      universe,
    };
  }
  if (completedDaysCount >= 3) {
    return {
      rankTitle: isMHA ? 'U.A. Дадлагажигч Сурагч' : 'Kanoe (Туршлагатай ангууч)',
      rankBadge: '⚡',
      breathingStyle: isMHA ? 'Full Cowl 5%' : 'Усны амьсгал • Төвлөрөл',
      buddyBondPercent,
      heroQuote: isMHA
        ? 'Эхлээд алхам алхмаар суралцана!'
        : 'Анхаарлаа бүрэн төвлөрүүл! Би чадна!',
      shieldStatus: 'Бамбай идэвхтэй: Цуврал хамгаалагдсан',
      universe,
    };
  }

  return {
    rankTitle: isMHA ? 'U.A. Шинэ элсэгч' : 'Mizunoto (Усны шинэ цэрэг)',
    rankBadge: '🌿',
    breathingStyle: isMHA ? 'Баатрын сургуулилт эхэллээ' : 'Усны амьсгал • Үндэс',
    buddyBondPercent,
    heroQuote: isMHA
      ? 'Хүн бүрийг инээмсэглэлээр аврах баатар болно!'
      : 'Нөхдөө хамгаалахын тулд өдөр бүр бэлтгэл хийнэ!',
    shieldStatus: 'Бамбай идэвхтэй: Эхний өдрийн хамгаалалт',
    universe,
  };
}
