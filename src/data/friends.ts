import { ProfileId } from '../types';

export interface FriendCharacter {
  id: string;
  name: string;
  role: string;
  avatar: string;
  series: string;
}

export const FRIENDS_BY_PROFILE: Record<ProfileId, FriendCharacter[]> = {
  sister: [
    { id: 'minjun', name: 'Min-jun', role: 'Шилдэг сурагч', avatar: '🌸', series: 'K-Drama' },
    { id: 'eunwoo', name: 'Eun-woo', role: 'Хөгжимчин найз', avatar: '✨', series: 'K-Drama' },
    { id: 'seojun', name: 'Seo-jun', role: 'Спортлог найз', avatar: '🍃', series: 'K-Drama' },
    { id: 'haneul', name: 'Ha-neul', role: 'Зураач найз', avatar: '☁️', series: 'K-Drama' },
    { id: 'jiwoo', name: 'Ji-woo', role: 'Цуврал сонирхогч', avatar: '🌷', series: 'K-Drama' },
    { id: 'emma', name: 'Emma', role: 'Герман сурагч найз', avatar: '🎀', series: 'Герман найз' },
    { id: 'sophie', name: 'Sophie', role: 'Эелдэг найз охин', avatar: '⭐', series: 'Герман найз' },
  ],

  brother1: [
    { id: 'saber', name: 'Saber', role: 'Сэлэмчин / Assassin', avatar: '⚡', series: 'Mobile Legends' },
    { id: 'alucard', name: 'Alucard', role: 'Баатар / Fighter', avatar: '⚔️', series: 'Mobile Legends' },
    { id: 'chou', name: 'Chou', role: 'Кунг-фу мастер', avatar: '🥊', series: 'Mobile Legends' },
    { id: 'gusion', name: 'Gusion', role: 'Хурц хутгач', avatar: '🗡️', series: 'Mobile Legends' },
    { id: 'lancelot', name: 'Lancelot', role: 'Сэлмийн хаан', avatar: '🛡️', series: 'Mobile Legends' },
    { id: 'hayabusa', name: 'Hayabusa', role: 'Сүүдрийн нинжа', avatar: '🥷', series: 'Mobile Legends' },
    { id: 'fanny', name: 'Fanny', role: 'Кабель мастер', avatar: '🕊️', series: 'Mobile Legends' },
    { id: 'layla', name: 'Layla', role: 'Буудагч / Marksman', avatar: '🎯', series: 'Mobile Legends' },
    { id: 'bruno', name: 'Bruno', role: 'Бөмбөгч / Marksman', avatar: '⚽', series: 'Mobile Legends' },
    { id: 'tigreal', name: 'Tigreal', role: 'Танк / Хамгаалагч', avatar: '🏰', series: 'Mobile Legends' },
  ],

  brother2: [
    { id: 'tanjiro', name: 'Tanjiro', role: 'Усны амьсгал мастер', avatar: '🛡️', series: 'Demon Slayer' },
    { id: 'zenitsu', name: 'Zenitsu', role: 'Аянгын хурд', avatar: '⚡', series: 'Demon Slayer' },
    { id: 'inosuke', name: 'Inosuke', role: 'Араатны амьсгал', avatar: '🐗', series: 'Demon Slayer' },
    { id: 'nezuko', name: 'Nezuko', role: 'Энхрий охин дүү', avatar: '🌸', series: 'Demon Slayer' },
    { id: 'rengoku', name: 'Rengoku', role: 'Галын хашира', avatar: '🔥', series: 'Demon Slayer' },
    { id: 'giyu', name: 'Giyu', role: 'Усны хашира', avatar: '🌊', series: 'Demon Slayer' },
    { id: 'deku', name: 'Deku', role: 'One For All өвлөгч', avatar: '🥦', series: 'My Hero Academia' },
    { id: 'todoroki', name: 'Todoroki', role: 'Гал ба Мөс мастер', avatar: '❄️', series: 'My Hero Academia' },
    { id: 'bakugo', name: 'Bakugo', role: 'Дэлбэрэлтийн мастер', avatar: '💥', series: 'My Hero Academia' },
    { id: 'allmight', name: 'All Might', role: 'Энх тайвны бэлгэдэл', avatar: '⭐', series: 'My Hero Academia' },
  ],
};
