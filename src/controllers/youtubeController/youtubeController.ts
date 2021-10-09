import { google } from 'googleapis';
import { AppError } from 'utils/AppError';
import { asyncErrorCatcher } from 'utils/asyncErrorCatcher';
import { TGetVideoHandler } from './types';

const youtube = google.youtube('v3');
const apiKey = process.env.YOUTUBE_API_KEY;

export const getVideo = asyncErrorCatcher<TGetVideoHandler>(async (req, res, next) => {
  const { videoType, gameName, platform } = req.params;
  const words = `${gameName.split(' ').join('+')}+${platform}+${videoType}`;

  if (!apiKey) {
    return next(new AppError('apiKey has not been found', 500));
  }

  const response = await youtube.search.list({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    key: apiKey,
    part: 'snippet',
    type: 'video',
    q: words,
    maxResults: 5,
    order: 'relevance',
    videoEmbeddable: true,
  });

  const bestMatchedVideoId = (response.data.items && response.data.items[0].id?.videoId) || null;

  return res.json({ status: 'success', payload: bestMatchedVideoId });
});
