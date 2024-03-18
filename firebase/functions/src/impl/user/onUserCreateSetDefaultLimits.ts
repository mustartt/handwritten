import {auth} from "firebase-functions";
import {setUserDefaultUsage} from "../../lib/quotas";


export const onUserCreateSetDefaultLimits = auth.user()
    .onCreate(async (user, context) => {
        await setUserDefaultUsage(user.uid);
    });
