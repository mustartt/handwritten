import * as admin from "firebase-admin";

import {extractTextVision} from "./impl/api/extractTextVision";
import {createProject} from "./impl/api/createProject";
import {onProjectCreatedUpdateProjectUsage} from "./impl/firestore/onProjectCreatedUpdateProjectUsage";
import {onProjectDeletedUpdateProjectUsage} from "./impl/firestore/onProjectDeletedUpdateProjectUsage";
import {generateImagePreview} from './impl/storage/generateImagePreview';
import {updateProjectItemStatus} from "./impl/pubsub/updateProjectItemStatus";
import {notifyUpload} from "./impl/storage/notifyUpload";
import {onUserCreateSetDefaultLimits} from "./impl/user/onUserCreateSetDefaultLimits";

admin.initializeApp();

export {
    // extractTextVision,

    // project
    createProject,

    // quotas
    onUserCreateSetDefaultLimits,
    onProjectCreatedUpdateProjectUsage,
    onProjectDeletedUpdateProjectUsage,

    // storage
    generateImagePreview,

    // testing
    updateProjectItemStatus,
    notifyUpload
};

