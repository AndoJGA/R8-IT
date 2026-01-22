import { tmdbFetch, IMAGE_BASE } from './tmdbClient';

export const getLogo = async (type, id) => {
    const data = await tmdbFetch(`/${type}/${id}/images`);
    const englishLogo = data.logos?.find(l => l.iso_639_1 === 'en');
    return englishLogo ? `${IMAGE_BASE}${englishLogo.file_path}` : null;
};