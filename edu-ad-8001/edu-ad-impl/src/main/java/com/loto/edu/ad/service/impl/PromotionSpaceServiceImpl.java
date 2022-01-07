package com.loto.edu.ad.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.loto.edu.ad.entity.PromotionSpace;
import com.loto.edu.ad.mapper.PromotionSpaceMapper;
import com.loto.edu.ad.service.IPromotionSpaceService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author 蓝田_Loto
 * @since 2022-01-07
 */
@Service
public class PromotionSpaceServiceImpl extends ServiceImpl<PromotionSpaceMapper, PromotionSpace> implements IPromotionSpaceService {
    @Override
    public PromotionSpace getBySpaceKey(String spaceKey) {
        QueryWrapper<PromotionSpace> queryWrapper = new QueryWrapper();

        // 根据spaceKey获取PromotionSpace
        queryWrapper.eq("spaceKey", spaceKey);
        return this.getBaseMapper().selectOne(queryWrapper);
    }
}
