package com.loto.edu.boss.controller;

import com.loto.edu.remote.AdRemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Author：蓝田_Loto
 * <p>Date：2022-01-07 16:21</p>
 * <p>PageName：AdSpaceController.java</p>
 * <p>Function：广告位</p>
 */

@RestController
@RequestMapping("/adSpace")
public class AdSpaceController {
    @Autowired
    AdRemoteService adRemoteService;

}
