use discord_util_bot_v3;

create table backup_progress (
	channel_id bigint not null comment "チャンネルID",
    last_backup_message_id bigint not null comment "最終バックアップ済みメッセージID",
    primary key(channel_id)
);