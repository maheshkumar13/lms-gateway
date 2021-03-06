

/**
 @author Aslam Shaik
 @date    23/01/2018
*/


const express = require('express');

const router = express.Router();

const controller = require('./textbook.controller');

const Multer = require('multer');

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

router.post('/uploadBranchMapping', multer.single('file'), controller.uploadBranchAndOrientationiMappingTextbook)

module.exports = router;