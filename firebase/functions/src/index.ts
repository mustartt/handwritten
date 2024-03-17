import * as admin from "firebase-admin";

import {extractTextVision} from "$func/api/extractTextVision";
import {createProject} from "$func/api/createProject";
import {onProjectCreatedUpdateProjectUsage} from "$func/firestore/onProjectCreatedUpdateProjectUsage";
import {onProjectDeletedUpdateProjectUsage} from "$func/firestore/onProjectDeletedUpdateProjectUsage";
import {generateImagePreview} from '$func/storage/generateImagePreview'
import {scanImage} from "$func/api/scanImage";

admin.initializeApp();

export {
    extractTextVision,
    scanImage,

    // project
    createProject,
    onProjectCreatedUpdateProjectUsage,
    onProjectDeletedUpdateProjectUsage,

    // storage
    generateImagePreview,
};

