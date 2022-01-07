package com.loto.edu.remote;

import com.loto.edu.dto.PromotionSpaceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient(name = "${remote.feign.edu-adSpace.name:edu-adSpace}", path = "/adSpace")
public interface AdSpaceRemoteService {
    /**
     * 获取所有广告位
     */
    @RequestMapping("/adSpace/getAllSpaces")
    public List<PromotionSpaceDTO> getAllSpaces();
}
