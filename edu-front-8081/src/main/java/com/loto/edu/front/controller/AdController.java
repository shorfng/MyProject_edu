package com.loto.edu.front.controller;

import com.loto.edu.common.result.ResponseDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import com.loto.edu.remote.AdRemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Author：蓝田_Loto
 * <p>Date：2022-01-07 16:21</p>
 * <p>PageName：AdController.java</p>
 * <p>Function：</p>
 */

@RestController
@RequestMapping("/ad")
public class AdController {
    @Autowired
    AdRemoteService adRemoteService;

    /**
     * 获取所有的广告位及其对应的广告
     */
    @RequestMapping("/getAllAdsBySpaceKey")
    public ResponseDTO getAllAdsBySpaceKey(@RequestParam("spaceKey") String[] spaceKey) {
        List<PromotionSpaceDTO> spaceDTOList = adRemoteService.getAllAdsBySpaceKey(spaceKey);

        return ResponseDTO.success(spaceDTOList);
    }
}
