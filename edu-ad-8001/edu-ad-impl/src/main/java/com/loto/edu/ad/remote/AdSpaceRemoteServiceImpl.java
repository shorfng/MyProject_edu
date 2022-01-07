package com.loto.edu.ad.remote;

import cn.hutool.core.bean.BeanUtil;
import com.loto.edu.ad.entity.PromotionSpace;
import com.loto.edu.ad.service.IPromotionSpaceService;
import com.loto.edu.dto.PromotionSpaceDTO;
import com.loto.edu.remote.AdSpaceRemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/adSpace")
public class AdSpaceRemoteServiceImpl implements AdSpaceRemoteService {
    @Autowired
    private IPromotionSpaceService promotionSpaceService;

    /**
     * 获取所有广告位
     */
    @RequestMapping("/getAllSpaces")
    public List<PromotionSpaceDTO> getAllSpaces() {
        List<PromotionSpace> spaces = promotionSpaceService.list();
        List<PromotionSpaceDTO> spaceDTOS = new ArrayList<>();

        for (PromotionSpace space : spaces) {
            PromotionSpaceDTO promotionSpaceDTO = new PromotionSpaceDTO();
            BeanUtil.copyProperties(space, promotionSpaceDTO);
            spaceDTOS.add(promotionSpaceDTO);
        }

        return spaceDTOS;
    }
}
