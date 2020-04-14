# mongodb部署

## 版本

mongo4.2，据说还没完全投入生产，大家自己横量，反正我只学最新的2333

## 部署过程

```mongo
use MyOauth_2.0;
db.createCollection("User")
db.createCollection("App")
db.createCollection("Token")

# 实例：
# 这里的其他信息自己判断
db.User.insert({uid:0,username:"游鱼星",password:"123456",signature:"the other info",})
db.App.insert({client_ID:0,client_secret:"123456",client_type:0,client_info:"the first app",})
db.Token.insert({client_ID:0,uid:0,authCode:"123456",token:"123456",token_time:ISODate()})

```

ps:这里的数据表之间是缺少关系的。
