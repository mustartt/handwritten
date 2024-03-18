import {ScanBorder} from "../../lib/image";
import {HttpsError, onCall} from "firebase-functions/v2/https";
import {firestore} from "firebase-admin";
import {getStorage} from "firebase-admin/storage";
import {v4 as uuidv4} from 'uuid';
import {projectFileSchema} from "../../lib/projectFile";
import {ScanApiImageResponse, scanRequestSchema} from "../../lib/scan-api";


//
// export const scanImage = onCall(
//     {cors: true,},
//     async (request) => {
//         const {itemId, scanBorder, settings} = scanApiRequestSchema.parse(request.data);
//         const uid = request.auth?.uid;
//         if (!uid) {
//             return new HttpsError('unauthenticated', 'not logged in');
//         }
//
//         const db = firestore();
//
//         const itemRef = db.doc(`items/${itemId}`);
//         const itemDoc = await itemRef.get();
//         if (!itemDoc.exists) {
//             return new HttpsError('not-found', 'item not found');
//         }
//         const itemData = projectItemSchema.parse(itemDoc.data());
//
//         const bucket = getStorage().bucket();
//         const downloadResponse = await bucket.file(`preview/${itemId}`).download();
//         const imageBase64 = downloadResponse[0].toString('base64');
//
//         let requestBody = {
//             id: uuidv4(),
//             scan_type: settings.documentType,
//             image_url: 'data:image/jpeg;base64,' + imageBase64,
//             ...(scanBorder ? {scan_border: formatScanBorder(scanBorder)} : {})
//         };
//         const scanResultResponse = await fetch('https://docscanner-krqk5btmpq-uc.a.run.app/api/v1/image/scan', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody)
//         });
//         const scanResult = scanApiResponseSchema.parse(await scanResultResponse.json());
//
//         const bufferHeader = 'data:image/jpeg;base64,';
//         const scanBuffer = Buffer.from(scanResult.image_data.substring(bufferHeader.length), 'base64');
//
//         const file = bucket.file(`scan/${itemId}`);
//         await file.save(scanBuffer, {
//             metadata: {
//                 contentType: 'image/jpeg',
//             }
//         });
//         await file.makePublic();
//
//         return {
//             scanUri: file.publicUrl(),
//             scanBorder: convertToScanBorder(scanResult.scan_border)
//         };
//     });
