package com.loto.edu.remote;

import com.loto.edu.common.result.ResponseDTO;
import com.loto.edu.dto.PromotionAdDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "${remote.feign.edu-ad.name:edu-ad}", path = "/ad")
public interface AdRemoteService {
    /**
     * 获取所有广告位信息
     */
    @RequestMapping("/space/getAllSpaces")
    public List<PromotionSpaceDTO> getAllSpaces();

    /**
     * 新增或者修改广告位信息
     */
    @GetMapping("/space/saveOrUpdateSpace")
    ResponseDTO saveOrUpdateSpace(@RequestBody PromotionSpaceDTO promotionSpaceDTO);

    /**
     * 根据 Id 获取广告位信息
     */
    @GetMapping("/space/getSpaceById")
    PromotionSpaceDTO getSpaceById(@RequestParam("id") Integer id);

    /**
     * 通过 spaceKey 获取所有的广告信息
     */
    @GetMapping("/getAllAdsBySpaceKey")
    List<PromotionSpaceDTO> getAllAdsBySpaceKey(@RequestParam("spaceKey") String[] spaceKey);

    /**
     * 获取所有广告信息
     */
    @GetMapping("/getAllAds")
    List<PromotionAdDTO> getAllAds();

    /**
     * 新增或者修改广告信息
     */
    @PostMapping("/saveOrUpdateAd")
    ResponseDTO saveOrUpdateAd(@RequestBody PromotionAdDTO promotionAdDTO);

    /**
     * 根据 Id获取广告信息
     */
    @GetMapping("/getAdById")
    PromotionAdDTO getAdById(@RequestParam("id") Integer id);
}
