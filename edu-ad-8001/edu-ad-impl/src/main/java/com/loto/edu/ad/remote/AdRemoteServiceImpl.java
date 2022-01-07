package com.loto.edu.ad.remote;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.loto.edu.ad.entity.PromotionAd;
import com.loto.edu.ad.entity.PromotionSpace;
import com.loto.edu.ad.service.IPromotionAdService;
import com.loto.edu.ad.service.IPromotionSpaceService;
import com.loto.edu.common.util.ConvertUtils;
import com.loto.edu.dto.PromotionAdDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import com.loto.edu.remote.AdRemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/ad")
public class AdRemoteServiceImpl implements AdRemoteService {
    @Autowired
    private IPromotionSpaceService promotionSpaceService;

    @Autowired
    private IPromotionAdService promotionAdService;

    /**
     * 通过 spaceKey 获取所有的广告信息
     */
    @GetMapping("/getAllAdsBySpaceKey")
    public List<PromotionSpaceDTO> getAllAdsBySpaceKey(String[] spaceKey) {
        List<PromotionSpaceDTO> spaceDTOList = new ArrayList<>();

        // 遍历 spaceKeys
        for (String key : spaceKey) {
            QueryWrapper<PromotionSpace> spaceQueryWrapper = new QueryWrapper<>();
            spaceQueryWrapper.eq("spaceKey", key);

            // 根据 spaceKey 获取 PromotionSpace 广告位对象
            PromotionSpace promotionSpace = promotionSpaceService.getOne(spaceQueryWrapper);
            if (promotionSpace == null) {
                continue;
            }

            // 根据 PromotionSpaceId 获取对应的 PromotionAd 广告信息
            QueryWrapper<PromotionAd> adQueryWrapper = new QueryWrapper<>();
            adQueryWrapper.eq("spaceId", promotionSpace.getId());
            adQueryWrapper.eq("status", 1);   // 上架状态
            Date now = new Date();
            adQueryWrapper.lt("startTime", now);
            adQueryWrapper.lt("endTime", now);

            List<PromotionAd> promotionAdList = promotionAdService.list(adQueryWrapper);

            // promotionAdList 转换成 promoteSpaceDTO
            List<PromotionAdDTO> promotionAdDTOList = ConvertUtils.convertList(promotionAdList, PromotionAdDTO.class);
            // promotionSpace 转换成 PromotionSpaceDTO
            PromotionSpaceDTO promotionSpaceDTO = ConvertUtils.convert(promotionSpace, PromotionSpaceDTO.class);

            promotionSpaceDTO.setAdDTOList(promotionAdDTOList);
            spaceDTOList.add(promotionSpaceDTO);
        }

        return spaceDTOList;
    }
}
