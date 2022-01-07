package com.loto.edu.remote;

import com.loto.edu.common.result.ResponseDTO;
import com.loto.edu.dto.PromotionAdDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "${remote.feign.edu-ad.name:edu-ad}", path = "/ad")
public interface AdRemoteService {
    /**
     * 获取所有广告位
     */
    @RequestMapping("/space/getAllSpaces")
    public List<PromotionSpaceDTO> getAllSpaces();

    @GetMapping("/getAllAds")
    List<PromotionSpaceDTO> getAllAds(@RequestParam("spaceKeys") String[] spaceKeys);

    //广告位的新增或者修改
    @RequestMapping(value = "/space/saveOrUpdate", method = RequestMethod.POST)
    public ResponseDTO saveOrUpdate(@RequestBody PromotionSpaceDTO promotionSpaceDTO);

    //获取单个广告位
    @RequestMapping("/space/getSpaceById")
    public PromotionSpaceDTO getPromotionSpaceById(@RequestParam("id") Integer id);

    //新增或者修改广告信息
    @RequestMapping(value = "/saveOrUpdate", method = RequestMethod.POST)
    public ResponseDTO saveOrUpdate(@RequestBody PromotionAdDTO promotionAdDTO);


    //根据ID获取对应的广告
    @RequestMapping("/getAdById")
    public PromotionAdDTO getAdById(@RequestParam("id") Integer id);


    //获取所有的广告
    @RequestMapping("/getAdList")
    public List<PromotionAdDTO> getAdList();

    //获取所有的广告
    @RequestMapping("/updateStatus")
    public ResponseDTO updateStatus(@RequestParam("id") Integer id, @RequestParam("status") Integer status);
}
