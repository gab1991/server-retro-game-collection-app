import { Profile } from 'models/Profile';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { IReqWithCookies } from 'typings/requests';
import { IResWithProfile } from 'typings/responses';

export const fetchVerifiedProfile: TAsyncMiddleWare<IReqWithCookies, IResWithProfile> = async (req, res, next) => {
  const verifiedId = res.locals.verifiedUserId;

  const profile = await Profile.findOne({
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
