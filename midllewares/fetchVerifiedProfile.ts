import { Profile } from 'models/Profile';
import { IProfile } from 'models/types';
import { TAsyncMiddleWare } from 'typings/middlewares';
import { IReqWithProfile } from 'typings/requests';

const fetchVerifiedProfile: TAsyncMiddleWare<IReqWithProfile> = async (req, res, next) => {
  const verifiedId = req.verifiedUserId;

  const profile: IProfile = await Profile.findOne({
    _id: verifiedId,
  });

  if (!profile) {
    return res.status(400).send({
      err_message: 'No such user',
    });
  }

  req.profile = profile;
  return next();
};

module.exports = { fetchVerifiedProfile };
