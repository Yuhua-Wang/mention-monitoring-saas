package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Mention;

import java.util.*;

public class TwitterAdaptor implements SocialMediaAPIAdaptor {

    @Override
    public List<Mention> getData() {
        return new ArrayList<>();
    }

    @Override
    public List<Mention> getData(int last_id) {
        return new ArrayList<>();
    }
}
