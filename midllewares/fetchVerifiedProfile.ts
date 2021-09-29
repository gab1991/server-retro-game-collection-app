import { Profile } from 'models/Profile';
import { IProfile } from 'models/types';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { IReqWithCookies } from 'typings/requests';
import { IResWithProfile, IResWithVerifiedId } from 'typings/responses';

export const fetchVerifiedProfile: TAsyncMiddleWare<IReqWithCookies, IResWithProfile> = async (req, res, next) => {
  const verifiedId = res.locals.verifiedUserId;

  const profile: IProfile = await Profile.findOne({
    _id: verifiedId,
  });

  if (!profile) {
    return res.status(400).send({
      err_message: 'No such user',
      status: 'fail',
    });
  }

  res.locals.profile = profile;

  return next();
};
