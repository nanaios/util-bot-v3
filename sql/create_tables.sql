use discord_util_bot_v3;

create table backup_progress (
	channel_id varchar(24) not null comment "チャンネルID",
    last_backup_message_id varchar(24) not null comment "最終バックアップ済みメッセージID",
    primary key(channel_id)
);