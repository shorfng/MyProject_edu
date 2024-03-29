package com.loto.edu.ad.controller;

import com.loto.edu.ad.entity.PromotionSpace;
import com.loto.edu.ad.service.IPromotionSpaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Author：蓝田_Loto
 * <p>Date：2022-01-07</p>
 * <p>PageName：PromotionSpaceController.java</p>
 * <p>Function：广告位</p>
 */

@RestController
@RequestMapping("/adSpace")
public class PromotionSpaceController {
    @Autowired
    private IPromotionSpaceService promotionSpaceService;

    //http://localhost:8001/adSpace/getAllSpaces
    /**
     * 查询所有广告定位信息列表
     */
    @GetMapping("/getAllSpaces")
    @ResponseBody
    public List<PromotionSpace> getAllSpaces() {
        List<PromotionSpace> spaceList = promotionSpaceService.list();
        return spaceList;
    }

}
