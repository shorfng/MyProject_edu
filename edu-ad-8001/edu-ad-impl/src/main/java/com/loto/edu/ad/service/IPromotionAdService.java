package com.loto.edu.ad.service;

import com.loto.edu.ad.entity.PromotionAd;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author 蓝田_Loto
 * @since 2022-01-07
 */
public interface IPromotionAdService extends IService<PromotionAd> {
    List<PromotionAd> getByPromotionSpaceId(Integer promotionSpaceId);

}
