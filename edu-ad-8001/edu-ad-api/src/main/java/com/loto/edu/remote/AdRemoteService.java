package com.loto.edu.remote;

import com.loto.edu.dto.PromotionSpaceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "${remote.feign.edu-ad.name:edu-ad}", path = "/ad")
public interface AdRemoteService {
    /**
     * 获取所有广告位
     */
    @RequestMapping("/space/getAllSpaces")
    public List<PromotionSpaceDTO> getAllSpaces();

    /**
     * 通过 spaceKey 获取所有的广告信息
     */
    @GetMapping("/getAllAdsBySpaceKey")
    List<PromotionSpaceDTO> getAllAdsBySpaceKey(@RequestParam("spaceKey") String[] spaceKey);
}
