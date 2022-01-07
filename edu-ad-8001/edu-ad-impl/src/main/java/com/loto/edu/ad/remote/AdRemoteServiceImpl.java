package com.loto.edu.ad.remote;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.loto.edu.ad.entity.PromotionAd;
import com.loto.edu.ad.entity.PromotionSpace;
import com.loto.edu.ad.service.IPromotionAdService;
import com.loto.edu.ad.service.IPromotionSpaceService;
import com.loto.edu.common.result.ResponseDTO;
import com.loto.edu.common.util.ConvertUtils;
import com.loto.edu.dto.PromotionAdDTO;
import com.loto.edu.dto.PromotionSpaceDTO;
import com.loto.edu.remote.AdRemoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Key;
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
     * 获取所有广告位
     */
    @RequestMapping("/space/getAllSpaces")
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
            adQueryWrapper.eq("spaceId",promotionSpace.getId());
            adQueryWrapper.eq("status",1);   // 上架状态
            Date now = new Date();
            adQueryWrapper.lt("startTime",now);
            adQueryWrapper.lt("endTime",now);

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

    //广告位的新增或者修改
    @RequestMapping(value = "/space/saveOrUpdate", method = RequestMethod.POST)
    public ResponseDTO saveOrUpdate(PromotionSpaceDTO promotionSpaceDTO) {
        PromotionSpace entity = new PromotionSpace();
        BeanUtil.copyProperties(promotionSpaceDTO, entity);
        ResponseDTO responseDTO = null;

        //保存或者更新
        try {
            entity.setUpdateTime(new Date());
            if (entity.getId() != null) {
                promotionSpaceService.updateById(entity);
            } else {
                entity.setIsDel(0);
                entity.setCreateTime(new Date());
                promotionSpaceService.save(entity);
            }
            responseDTO = ResponseDTO.success();
        } catch (Exception e) {
            responseDTO = ResponseDTO.ofError(e.getMessage());
            throw e;
        }
        return responseDTO;
    }

    //获取单个广告位
    @RequestMapping("/space/getSpaceById")
    public PromotionSpaceDTO getPromotionSpaceById(Integer id) {
        PromotionSpace prospaceSpace = promotionSpaceService.getById(id);
        PromotionSpaceDTO promotionSpaceDTO = new PromotionSpaceDTO();
        BeanUtil.copyProperties(prospaceSpace, promotionSpaceDTO);
        return promotionSpaceDTO;
    }


    //新增或者修改广告信息
    @RequestMapping(value = "/saveOrUpdate", method = RequestMethod.POST)
    public ResponseDTO saveOrUpdate(PromotionAdDTO promotionAdDTO) {
        PromotionAd entity = new PromotionAd();
        BeanUtil.copyProperties(promotionAdDTO, entity);
        ResponseDTO responseDTO = null;

        //保存或者更新
        try {
            entity.setUpdateTime(new Date());
            if (entity.getId() != null) {
                //修改广告信息
                promotionAdService.updateById(entity);
            } else {
                entity.setCreateTime(new Date());         //创建时间
                //新增广告
                promotionAdService.save(entity);
            }
            responseDTO = ResponseDTO.success();
        } catch (Exception e) {
            responseDTO = ResponseDTO.ofError(e.getMessage());
            throw e;
        }
        return responseDTO;
    }

    //根据ID获取对应的广告
    @RequestMapping("/getAdById")
    public PromotionAdDTO getAdById(Integer id) {

        PromotionAdDTO promotionAdDTO = new PromotionAdDTO();
        PromotionAd promotionAd = promotionAdService.getById(id);
        BeanUtil.copyProperties(promotionAd, promotionAdDTO);
        return promotionAdDTO;
    }

    //获取所有的广告
    @RequestMapping("/getAdList")
    public List<PromotionAdDTO> getAdList() {
        List<PromotionAdDTO> adDTOList = new ArrayList<>();

        List<PromotionAd> adList = promotionAdService.list();
        for (PromotionAd promotionAd : adList) {
            PromotionAdDTO promotionAdDTO = new PromotionAdDTO();
            BeanUtil.copyProperties(promotionAd, promotionAdDTO);
            adDTOList.add(promotionAdDTO);
        }
        return adDTOList;
    }

    //获取所有的广告
    @RequestMapping("/updateStatus")
    public ResponseDTO updateStatus(Integer id, Integer status) {

        ResponseDTO responseDTO = null;
        try {
            if (status == 0 || status == 1) {
                PromotionAd promotionAd = new PromotionAd();
                promotionAd.setId(id);
                promotionAd.setStatus(status);
                promotionAdService.updateById(promotionAd);
                responseDTO = ResponseDTO.success();
            }
        } catch (Exception e) {
            responseDTO = ResponseDTO.ofError(e.getMessage());
            throw e;
        }
        return responseDTO;
    }


}
