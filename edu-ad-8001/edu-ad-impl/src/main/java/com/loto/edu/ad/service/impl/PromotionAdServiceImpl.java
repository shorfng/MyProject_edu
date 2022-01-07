package com.loto.edu.ad.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.loto.edu.ad.entity.PromotionAd;
import com.loto.edu.ad.mapper.PromotionAdMapper;
import com.loto.edu.ad.service.IPromotionAdService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author 蓝田_Loto
 * @since 2022-01-07
 */
@Service
public class PromotionAdServiceImpl extends ServiceImpl<PromotionAdMapper, PromotionAd> implements IPromotionAdService {

    @Override
    public List<PromotionAd> getByPromotionSpaceId(Integer spaceId) {
        QueryWrapper<PromotionAd> queryWrapper = new QueryWrapper<>();

        // 根据promoteSpaceId查询SpromoteAd
        queryWrapper.eq("spaceId", spaceId);

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowString = format.format(new Date());

        // 在有效期内
        queryWrapper.gt("endTime", nowString);
        queryWrapper.lt("startTime", nowString);

        return this.getBaseMapper().selectList(queryWrapper);
    }
}
