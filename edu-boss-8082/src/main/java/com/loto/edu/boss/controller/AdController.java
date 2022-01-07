package com.loto.edu.boss.controller;

import com.loto.edu.common.result.ResponseDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import com.loto.edu.remote.AdRemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Author：蓝田_Loto
 * <p>Date：2022-01-07 14:27</p>
 * <p>PageName：AdController.java</p>
 * <p>Function：</p>
 */

@RestController
@RequestMapping("/ad")
public class AdController {
    @Autowired
    private AdRemoteService adRemoteService;

    @RequestMapping("/space/getAllSpaces")
    public ResponseDTO getAllSpaces(){
        List<PromotionSpaceDTO> spaceDTOList = adRemoteService.getAllSpaces();
        return ResponseDTO.success(spaceDTOList);
    }

}
