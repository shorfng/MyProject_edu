package com.loto.edu.boss.controller;

import com.loto.edu.common.result.ResponseDTO;
import com.loto.edu.common.result.ResultCode;
import com.loto.edu.dto.PromotionAdDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import com.loto.edu.remote.AdRemoteService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Author：蓝田_Loto
 * <p>Date：2022-01-07 14:27</p>
 * <p>PageName：AdController.java</p>
 * <p>Function：广告</p>
 */

@RestController
@RequestMapping("/ad")
public class AdController {
    @Autowired
    private AdRemoteService adRemoteService;

    /**
     * 获取所有广告位信息
     */
    @RequestMapping("/space/getAllSpaces")
    public ResponseDTO getAllSpaces() {
        List<PromotionSpaceDTO> allSpacesList = adRemoteService.getAllSpaces();

        return ResponseDTO.success(allSpacesList);
    }

    /**
     * 新增或者修改广告位信息
     */
    @PostMapping("/space/saveOrUpdateSpace")
    public ResponseDTO saveOrUpdateSpace(@RequestBody PromotionSpaceDTO promotionSpaceDTO) {
        return adRemoteService.saveOrUpdateSpace(promotionSpaceDTO);
    }

    /**
     * 根据 Id 获取广告位信息
     */
    @GetMapping("/space/getSpaceById")
    public ResponseDTO getSpaceById(@RequestParam("id") Integer id) {
        PromotionSpaceDTO promotionSpaceDTO = adRemoteService.getSpaceById(id);

        return ResponseDTO.success(promotionSpaceDTO);
    }

    /**
     * 获取所有的广告位及其对应的广告
     */
    @RequestMapping("/getAllAdsBySpaceKey")
    public ResponseDTO getAllAdsBySpaceKey(@RequestParam("spaceKey") String[] spaceKey) {
        List<PromotionSpaceDTO> spaceDTOList = adRemoteService.getAllAdsBySpaceKey(spaceKey);

        return ResponseDTO.success(spaceDTOList);
    }

    /**
     * 获取所有广告信息
     */
    @GetMapping("/getAllAds")
    public ResponseDTO getAllAds() {
        List<PromotionAdDTO> adDTOList = adRemoteService.getAllAds();

        return ResponseDTO.success(adDTOList);
    }
}
