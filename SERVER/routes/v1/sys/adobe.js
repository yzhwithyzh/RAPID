/*@author YZH
*@date 2024/06/05
*@Description:adobe配置的接口
*/

const express = require('express');
const router = express.Router();
const adobeController = require('@controllers/v1/sys/adobeController')

/****************************************************************************/


router.post('/list', adobeController.getAll);

router.post('/create', adobeController.create);

router.post('/findOne', adobeController.findOne);

router.post('/update', adobeController.update);

router.post('/delete', adobeController.delete);

module.exports = router;