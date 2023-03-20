package com.cs5524.mention.monitoring.server;

import com.cs5524.mention.monitoring.server.database.model.Mention;

import java.util.*;


public interface SocialMediaAPIAdaptor {

    public List<Mention> getData();

    public List<Mention> getData(int last_id);



}
