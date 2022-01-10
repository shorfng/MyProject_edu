#! /bin/bash

timestamp=`date "+%Y%m%d%H%M"`
git_url=`git remote -v |grep push |awk '{print $2}'`
repo=`git remote -v |grep push |awk '{print $1}'`
project_name=`git remote -v |grep push |awk '{print $2}' |awk -F '/' '{print $NF}'|awk -F '.' '{print $1}'`
tag=${project_name}_${timestamp}

echo "地址：${git_url}"
echo "时间：${timestamp}"
echo "标签：${tag}"
echo "远程：${repo}"

echo 'enter "y"'
read confirm
if [[ $confirm = 'y' ]]; then
	git tag ${tag}
	git push ${repo} ${tag} --no-verify
fi

