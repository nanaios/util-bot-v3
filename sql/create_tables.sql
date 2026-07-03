use discord_util_bot_v3;

create table channel_info (
	channel_id bigint not null comment "チャンネルID",
    channel_name varchar(512) comment "チャンネル名",
    first_message_id bigint not null comment "ファーストメッセージid",
    primary key(channel_id)
);

create table backup_progress (
	channel_id bigint not null comment "チャンネルID",
    last_backup_message_id bigint not null comment "最終バックアップ済みメッセージID",
    primary key(channel_id),
    FOREIGN KEY (channel_id) REFERENCES channel_info(channel_id)
);